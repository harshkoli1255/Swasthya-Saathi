import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:swasthyasaathi_patient/features/interview/application/interview_controller.dart';
import 'package:swasthyasaathi_patient/features/voice/presentation/widgets/voice_recorder_widget.dart';
import 'package:swasthyasaathi_patient/features/documents/presentation/widgets/document_upload_widget.dart';

class InterviewScreen extends ConsumerStatefulWidget {
  const InterviewScreen({super.key});

  @override
  ConsumerState<InterviewScreen> createState() => _InterviewScreenState();
}

class _InterviewScreenState extends ConsumerState<InterviewScreen> {
  final TextEditingController _textController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(interviewControllerProvider.notifier).fetchNextQuestion();
    });
  }

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

  Future<void> _submitText() async {
    final text = _textController.text.trim();
    if (text.isEmpty) return;

    final success = await ref.read(interviewControllerProvider.notifier).submitTextAnswer(text);
    if (success && mounted) {
      _textController.clear();
      _checkCompletion();
    }
  }

  Future<void> _handleVoiceRecording(File file) async {
    final transcript = await ref.read(interviewControllerProvider.notifier).uploadVoice(file);
    if (transcript != null && mounted) {
      // Allow patient to review transcript before it becomes a clinical fact
      _textController.text = transcript;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please review your transcript and press submit.')),
      );
    }
  }

  Future<void> _handleDocumentUpload(File file) async {
    final extracted = await ref.read(interviewControllerProvider.notifier).uploadDocument(file);
    if (extracted != null && mounted) {
      // Extracted OCR text provided for patient review
      _textController.text = extracted;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please review the extracted document text and press submit.')),
      );
    }
  }

  void _checkCompletion() {
    final state = ref.read(interviewControllerProvider);
    if (state.currentQuestion != null && state.currentQuestion!.isComplete) {
      context.go('/review');
    }
  }

  @override
  Widget build(BuildContext context) {
    // Listen for completion changes
    ref.listen(interviewControllerProvider, (previous, next) {
      if (next.currentQuestion?.isComplete == true) {
        context.go('/review');
      }
    });

    final state = ref.watch(interviewControllerProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Consultation Intake'),
        automaticallyImplyLeading: false, // Prevent going back to consent
      ),
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            SliverFillRemaining(
              hasScrollBody: false,
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // 1. Question Display
                    Expanded(
                      child: Center(
                        child: state.isLoading
                            ? const CircularProgressIndicator()
                            : Text(
                                state.currentQuestion?.text ?? 'Preparing next question...',
                                style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                                textAlign: TextAlign.center,
                              ),
                      ),
                    ),

                    // 2. Error Display
                    if (state.errorMessage != null)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 16.0),
                        child: Text(
                          state.errorMessage!,
                          style: TextStyle(color: Theme.of(context).colorScheme.error, fontWeight: FontWeight.bold),
                          textAlign: TextAlign.center,
                        ),
                      ),

                    // 3. Processing Overlay
                    if (state.isUploading)
                      Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          children: [
                            const CircularProgressIndicator(),
                            const SizedBox(height: 16),
                            Text(state.processingStatus ?? 'Processing...', style: const TextStyle(fontSize: 18)),
                          ],
                        ),
                      )
                    else
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          // Text Input
                          TextField(
                            controller: _textController,
                            minLines: 1,
                            maxLines: 4,
                            decoration: InputDecoration(
                              hintText: 'Type your answer here...',
                              suffixIcon: IconButton(
                                icon: const Icon(Icons.send, color: Color(0xFF2E5E4E)),
                                onPressed: _submitText,
                              ),
                            ),
                            textInputAction: TextInputAction.send,
                            onSubmitted: (_) => _submitText(),
                          ),
                          const SizedBox(height: 24),
                          
                          const Text('OR', textAlign: TextAlign.center, style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 24),

                          // Voice and Document Options
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: [
                              Column(
                                children: [
                                  VoiceRecorderWidget(
                                    onRecordingComplete: _handleVoiceRecording,
                                  ),
                                  const SizedBox(height: 8),
                                  const Text('Hold to speak'),
                                ],
                              ),
                              Column(
                                children: [
                                  DocumentUploadWidget(
                                    onDocumentSelected: _handleDocumentUpload,
                                    isUploading: state.isUploading,
                                  ),
                                  const SizedBox(height: 8),
                                  const Text('Upload report'),
                                ],
                              ),
                            ],
                          ),
                        ],
                      ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
