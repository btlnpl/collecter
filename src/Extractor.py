import os

class FileScanner:
    data_root_dir = os.path.curdir

    def __init__(self, root_dir):
        self.data_root_dir = root_dir


    def get_all_files(self):
        all_files = []
        for root, dirs, files in os.walk(self.data_root_dir):
            for file in files:
                all_files.append(os.path.join(root, file))

        return all_files
if __name__ == '__main__':
    files = FileScanner("/home/bikash/IdeaProjects/analyticsPluginJS/data").get_all_files()
    print(files)
