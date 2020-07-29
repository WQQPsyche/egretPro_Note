class TestPlugin {

    onFile(file: any) {
        return file;
    }

    onFinish() {
    }
}


export const plugins = [new TestPlugin()];