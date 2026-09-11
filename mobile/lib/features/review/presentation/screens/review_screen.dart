import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:swasthyasaathi_patient/features/review/application/review_controller.dart';
import 'package:swasthyasaathi_patient/core/network/session_manager.dart';

class ReviewScreen extends ConsumerStatefulWidget {
  const ReviewScreen({super.key});

  @override
  ConsumerState<ReviewScreen> createState() => _ReviewScreenState();
}

class _ReviewScreenState extends ConsumerState<ReviewScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(reviewControllerProvider.notifier).fetchSummary();
    });
  }

  Future<void> _onConfirm() async {
    final success = await ref.read(reviewControllerProvider.notifier).confirmFacts();
    if (success && mounted) {
      // Clear volatile session on completion
      ref.read(sessionProvider.notifier).clearSession();
      context.go('/completion');
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(reviewControllerProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Review Your Information'),
        automaticallyImplyLeading: false,
      ),
      body: state.isLoading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Text(
                    'Please confirm the details we gathered before sharing them with your doctor.',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 24),
                  if (state.errorMessage != null)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 16.0),
                      child: Text(
                        state.errorMessage!,
                        style: TextStyle(color: Theme.of(context).colorScheme.error),
                      ),
                    ),
                  Expanded(
                    child: (state.summary?.facts.isEmpty ?? true)
                        ? const Center(child: Text('No information gathered.', style: TextStyle(fontSize: 18)))
                        : ListView.builder(
                            itemCount: state.summary!.facts.length,
                            itemBuilder: (context, index) {
                              final fact = state.summary!.facts[index];
                              return Card(
                                child: ListTile(
                                  title: Text(fact.slot.toUpperCase().replaceAll('_', ' ')),
                                  subtitle: Text(fact.value.toString(), style: const TextStyle(fontSize: 18, color: Colors.black87)),
                                  trailing: const Icon(Icons.check_circle, color: Colors.green),
                                ),
                              );
                            },
                          ),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: state.isSubmitting ? null : _onConfirm,
                    child: state.isSubmitting
                        ? const CircularProgressIndicator(color: Colors.white)
                        : const Text('I Confirm these Details'),
                  ),
                ],
              ),
            ),
    );
  }
}
