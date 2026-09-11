import 'dart:io';
import 'package:flutter/material.dart';
import 'package:record/record.dart';
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class VoiceRecorderWidget extends ConsumerStatefulWidget {
  final Future<void> Function(File audioFile) onRecordingComplete;

  const VoiceRecorderWidget({super.key, required this.onRecordingComplete});

  @override
  ConsumerState<VoiceRecorderWidget> createState() => _VoiceRecorderWidgetState();
}

class _VoiceRecorderWidgetState extends ConsumerState<VoiceRecorderWidget> {
  final _audioRecorder = AudioRecorder();
  bool _isRecording = false;
  String? _audioPath;

  @override
  void dispose() {
    _audioRecorder.dispose();
    _cleanupTempFile();
    super.dispose();
  }

  Future<void> _cleanupTempFile() async {
    if (_audioPath != null) {
      final file = File(_audioPath!);
      if (await file.exists()) {
        await file.delete();
      }
      _audioPath = null;
    }
  }

  Future<void> _startRecording() async {
    try {
      if (await Permission.microphone.request().isGranted) {
        final tempDir = await getTemporaryDirectory();
        _audioPath = '${tempDir.path}/temp_voice_intake_${DateTime.now().millisecondsSinceEpoch}.m4a';

        await _audioRecorder.start(
          const RecordConfig(encoder: AudioEncoder.aacLc, numChannels: 1, sampleRate: 16000),
          path: _audioPath!,
        );

        setState(() {
          _isRecording = true;
        });
      } else {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Microphone permission is required to record voice.')),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to start recording.')),
      );
    }
  }

  Future<void> _stopRecording() async {
    try {
      final path = await _audioRecorder.stop();
      setState(() {
        _isRecording = false;
      });

      if (path != null) {
        final file = File(path);
        // Delegate to parent (which calls backend), then delete the temp file immediately.
        await widget.onRecordingComplete(file);
        await _cleanupTempFile();
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to stop recording.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onLongPress: _startRecording,
      onLongPressUp: _stopRecording,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: EdgeInsets.all(_isRecording ? 24 : 16),
        decoration: BoxDecoration(
          color: _isRecording ? Theme.of(context).colorScheme.error.withValues(alpha: 0.1) : Theme.of(context).colorScheme.primary,
          shape: BoxShape.circle,
        ),
        child: Semantics(
          label: 'Hold to record voice',
          button: true,
          child: Icon(
            _isRecording ? Icons.mic : Icons.mic_none,
            size: _isRecording ? 48 : 32,
            color: _isRecording ? Theme.of(context).colorScheme.error : Theme.of(context).colorScheme.onPrimary,
          ),
        ),
      ),
    );
  }
}
