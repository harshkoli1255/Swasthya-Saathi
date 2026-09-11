import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:swasthyasaathi_patient/features/onboarding/presentation/screens/welcome_screen.dart';
import 'package:swasthyasaathi_patient/features/consent/presentation/screens/consent_screen.dart';
import 'package:swasthyasaathi_patient/features/interview/presentation/screens/interview_screen.dart';
import 'package:swasthyasaathi_patient/features/review/presentation/screens/review_screen.dart';
import 'package:swasthyasaathi_patient/features/completion/presentation/screens/completion_screen.dart';

// Placeholder screens for routing
class PlaceholderScreen extends StatelessWidget {
  final String title;
  const PlaceholderScreen({super.key, required this.title});
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(child: Text(title)),
    );
  }
}

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        name: 'welcome',
        builder: (context, state) => const WelcomeScreen(),
      ),
      GoRoute(
        path: '/intake/:token',
        name: 'intake_start',
        builder: (context, state) {
          final token = state.pathParameters['token']!;
          // Navigate to consent immediately as we don't have an intermediate intake init screen
          return ConsentScreen(token: token);
        },
      ),
      GoRoute(
        path: '/consent',
        name: 'consent',
        builder: (context, state) {
          // Temporarily hardcode a fake token if not passed. In reality it comes from intake/:token
          return const ConsentScreen(token: 'temp_token');
        },
      ),
      GoRoute(
        path: '/interview',
        name: 'interview',
        builder: (context, state) => const InterviewScreen(),
      ),
      GoRoute(
        path: '/review',
        name: 'review',
        builder: (context, state) => const ReviewScreen(),
      ),
      GoRoute(
        path: '/completion',
        name: 'completion',
        builder: (context, state) => const CompletionScreen(),
      ),
    ],
  );
});
