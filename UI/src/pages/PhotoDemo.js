import '@pqina/pintura/pintura.css';
import { useRef, useState } from 'react';
import { PinturaEditor } from '@pqina/react-pintura';
import { getEditorDefaults } from '@pqina/pintura';
import { Button } from 'antd';

const editorDefaults = getEditorDefaults({
    imageWriter: {
        targetSize: {
            width: 456,     
            height: 456,
        },
    },
});

function Photo() {
    const editorRef = useRef(null);

    const [editorResult, setEditorResult] = useState(undefined);
    const [showResult, setShowResult] = useState(false);

    const handleEditorProcess = (imageState) => {
        setEditorResult(URL.createObjectURL(imageState.dest));
        setShowResult(true);
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const url = event.target.result;
                editorRef.current.editor.loadImage(url).then((imageReaderResult) => {
                    setEditorResult(imageReaderResult);
                    setShowResult(false);
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadPostClick = () => {
        // Handle uploading the edited image as a post
        // Implement your upload logic here
    };

    return (
        <div className="App">
            {!showResult && (
                <>
                <input type="file" accept="image/*" onChange={handleFileSelect} /> 
                    <div className="App" style={{ height: '600px', width: '800px' }}>
                        <PinturaEditor
                            ref={editorRef}
                            {...editorDefaults}
                            enableMarkText={false}
                            onProcess={handleEditorProcess}
                        />
                    </div>
                    {/* <Button
                        onClick={handleUploadPostClick}
                        className='appPrimaryButton uploadPostBtn'
                        label='Upload Post'
                        type="file" accept="image/*" onChange={handleFileSelect}
                    /> */}
                </>
            )}

            {showResult && editorResult && (
                <div>
                    <img src={editorResult} alt="Edited" />
                </div>
            )}

        </div>
    );
}

export default Photo;