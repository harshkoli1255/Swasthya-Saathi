import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:swasthyasaathi_patient/core/models/api_models.dart';
import 'package:swasthyasaathi_patient/core/network/api_client.dart';
import 'package:dio/dio.dart';

class ConsentScreen extends ConsumerStatefulWidget {
  final String token;
  const ConsentScreen({super.key, required this.token});

  @override
  ConsumerState<ConsentScreen> createState() => _ConsentScreenState();
}

class _ConsentScreenState extends ConsumerState<ConsentScreen> {
  bool _agreed = false;
  bool _isLoading = false;
  String? _errorMessage;

  Future<void> _submitConsent() async {
    if (!_agreed) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final apiClient = ref.read(apiClientProvider);
      final response = await apiClient.submitConsent(
        const ConsentPayload(agreed: true, scope: ['FULL_CLINICAL_INTAKE']),
      );

      if (response.state == 'INTERVIEW' && mounted) {
        context.go('/interview');
      }
    } catch (e) {
      if (e is DioException && e.response?.statusCode == 400 && e.response?.data?['detail'] == 'Consent already processed') {
        if (mounted) {
          context.go('/interview');
        }
      } else {
        if (mounted) {
          setState(() {
            _errorMessage = "Failed to submit consent. Please try again.";
          });
        }
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Patient Consent')),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Before we begin...',
              style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            const Expanded(
              child: SingleChildScrollView(
                child: Text(
                  'SwasthyaSaathi uses AI to help gather your medical history before you see the doctor. '
                  'Your voice and documents will be processed securely. By proceeding, you agree to allow '
                  'us to extract your symptoms to save time for your consultation.\n\n'
                  'Your data is encrypted and will only be shared with your attending physician.',
                  style: TextStyle(fontSize: 18, height: 1.5),
                ),
              ),
            ),
            if (_errorMessage != null)
              Padding(
                padding: const EdgeInsets.only(bottom: 16.0),
                child: Text(
                  _errorMessage!,
                  style: TextStyle(color: Theme.of(context).colorScheme.error, fontWeight: FontWeight.bold),
                ),
              ),
            CheckboxListTile(
              title: const Text('I agree to the collection of my medical data for this consultation.', style: TextStyle(fontSize: 16)),
              value: _agreed,
              onChanged: (val) {
                setState(() => _agreed = val ?? false);
              },
              controlAffinity: ListTileControlAffinity.leading,
              contentPadding: EdgeInsets.zero,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _agreed && !_isLoading ? _submitConsent : null,
              child: _isLoading
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text('Start Intake'),
            ),
          ],
        ),
      ),
    );
  }
}
