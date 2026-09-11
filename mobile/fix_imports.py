import os
import glob

def replace_imports():
    for filepath in glob.glob('lib/**/*.dart', recursive=True):
        with open(filepath, 'r') as f:
            content = f.read()
            
        content = content.replace("import '../../../core/", "import 'package:swasthyasaathi_patient/core/")
        content = content.replace("import '../../../../core/", "import 'package:swasthyasaathi_patient/core/")
        content = content.replace("import '../../core/", "import 'package:swasthyasaathi_patient/core/")
        content = content.replace("import '../application/", "import 'package:swasthyasaathi_patient/features/interview/application/")
        content = content.replace("import '../../voice/presentation/", "import 'package:swasthyasaathi_patient/features/voice/presentation/")
        content = content.replace("import '../../documents/presentation/", "import 'package:swasthyasaathi_patient/features/documents/presentation/")
        content = content.replace("import '../../features/consent/", "import 'package:swasthyasaathi_patient/features/consent/")
        content = content.replace("import '../../features/interview/", "import 'package:swasthyasaathi_patient/features/interview/")
        
        with open(filepath, 'w') as f:
            f.write(content)

replace_imports()
