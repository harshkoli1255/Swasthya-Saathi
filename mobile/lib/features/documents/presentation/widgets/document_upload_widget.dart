import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class DocumentUploadWidget extends StatelessWidget {
  final Future<void> Function(File documentFile) onDocumentSelected;
  final bool isUploading;

  const DocumentUploadWidget({
    super.key,
    required this.onDocumentSelected,
    this.isUploading = false,
  });

  Future<void> _pickImage(ImageSource source) async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: source, imageQuality: 80);
    
    if (image != null) {
      final file = File(image.path);
      await onDocumentSelected(file);
      
      // Cleanup the temporary image file picked by image_picker
      if (await file.exists()) {
        await file.delete();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isUploading) {
      return const SizedBox.shrink(); // Hide buttons while processing
    }
    
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        OutlinedButton.icon(
          onPressed: () => _pickImage(ImageSource.camera),
          icon: const Icon(Icons.camera_alt),
          label: const Text('Camera'),
          style: OutlinedButton.styleFrom(
            minimumSize: const Size(120, 48),
          ),
        ),
        const SizedBox(width: 16),
        OutlinedButton.icon(
          onPressed: () => _pickImage(ImageSource.gallery),
          icon: const Icon(Icons.photo_library),
          label: const Text('Gallery'),
          style: OutlinedButton.styleFrom(
            minimumSize: const Size(120, 48),
          ),
        ),
      ],
    );
  }
}
