import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../features/onboarding/presentation/screens/welcome_screen.dart';
import '../../features/identity/presentation/screens/abha_input_screen.dart';
import '../../features/identity/presentation/screens/abha_otp_screen.dart';
import '../../features/identity/presentation/screens/abha_profile_screen.dart';
import '../../features/consent/presentation/screens/consent_screen.dart';
import '../../features/interview/presentation/screens/interview_screen.dart';
import '../../features/documents/presentation/screens/document_scanner_screen.dart';
import '../../features/review/presentation/screens/review_screen.dart';
import '../../features/completion/presentation/screens/completion_screen.dart';
import '../../features/completion/presentation/screens/pharmacy_token_screen.dart';
import '../../features/system/presentation/screens/system_states_screens.dart';

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
        path: '/abha/input',
        name: 'abha_input',
        builder: (context, state) => const AbhaInputScreen(),
      ),
      GoRoute(
        path: '/abha/otp',
        name: 'abha_otp',
        builder: (context, state) {
          final token = state.uri.queryParameters['token'] ?? '';
          final txnId = state.uri.queryParameters['txnId'] ?? '';
          final id = state.uri.queryParameters['id'] ?? '91-4829-1029-4820';
          return AbhaOtpScreen(token: token, txnId: txnId, identifier: id);
        },
      ),
      GoRoute(
        path: '/abha/profile',
        name: 'abha_profile',
        builder: (context, state) {
          final token = state.uri.queryParameters['token'] ?? '';
          final name = state.uri.queryParameters['name'] ?? 'Rahul Sharma';
          final abha = state.uri.queryParameters['abha'] ?? '91-4829-1029-4820';
          final addr = state.uri.queryParameters['addr'] ?? 'rahul.sharma@abdm';
          return AbhaProfileScreen(
            token: token,
            patientName: name,
            abhaNumber: abha,
            abhaAddress: addr,
          );
        },
      ),
      GoRoute(
        path: '/consent',
        name: 'consent',
        builder: (context, state) {
          final token = state.uri.queryParameters['token'] ?? 'demo-token';
          return ConsentScreen(token: token);
        },
      ),
      GoRoute(
        path: '/intake/:token',
        name: 'intake_token',
        builder: (context, state) {
          final token = state.pathParameters['token']!;
          return ConsentScreen(token: token);
        },
      ),
      GoRoute(
        path: '/interview',
        name: 'interview',
        builder: (context, state) {
          final token = state.uri.queryParameters['token'];
          return InterviewScreen(token: token);
        },
      ),
      GoRoute(
        path: '/scanner',
        name: 'scanner',
        builder: (context, state) {
          final token = state.uri.queryParameters['token'];
          return DocumentScannerScreen(token: token);
        },
      ),
      GoRoute(
        path: '/review',
        name: 'review',
        builder: (context, state) {
          final token = state.uri.queryParameters['token'];
          return ReviewScreen(token: token);
        },
      ),
      GoRoute(
        path: '/token',
        name: 'token',
        builder: (context, state) {
          final token = state.uri.queryParameters['token'];
          final opd = state.uri.queryParameters['opd'];
          return CompletionScreen(token: token, opdId: opd);
        },
      ),
      GoRoute(
        path: '/completion',
        name: 'completion',
        builder: (context, state) {
          final token = state.uri.queryParameters['token'];
          final opd = state.uri.queryParameters['opd'];
          return CompletionScreen(token: token, opdId: opd);
        },
      ),
      GoRoute(
        path: '/pharmacy',
        name: 'pharmacy',
        builder: (context, state) => const PharmacyTokenScreen(),
      ),
      GoRoute(
        path: '/offline',
        name: 'offline',
        builder: (context, state) => OfflineStateScreen(
          onRetry: () => context.go('/'),
        ),
      ),
      GoRoute(
        path: '/empty-records',
        name: 'empty_records',
        builder: (context, state) => EmptyHealthRecordsScreen(
          onScanPaper: () => context.push('/scanner'),
          onStartFresh: () => context.push('/interview'),
        ),
      ),
      GoRoute(
        path: '/mic-denied',
        name: 'mic_denied',
        builder: (context, state) => MicrophonePermissionDeniedScreen(
          onOpenSettings: () {},
          onSwitchToTyping: () => context.go('/interview'),
        ),
      ),
      GoRoute(
        path: '/camera-unavailable',
        name: 'camera_unavailable',
        builder: (context, state) => CameraUnavailableScreen(
          onPickGallery: () {},
          onSkip: () => context.go('/review'),
        ),
      ),
    ],
  );
});
