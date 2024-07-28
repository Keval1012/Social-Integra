import React, { useEffect, useState } from 'react';
import '../styles/posts.css';
import Button from '../components/AppButton';
import { Card, Checkbox, Col, Form, Modal, Row, Steps, Upload, message, Slider } from 'antd';
import Selectable from '../components/Selectable';
import { UnorderedListOutlined, UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { postAccounts, fb_app_id, pet_page_id } from '../constants';
import { getFbPageAccessToken, getIGPageAccessAndPost, shareLinkedinPost, sharePagePost, shareTwitterPost } from '../API/Api';
import { useSelector } from 'react-redux';
// import FB from 'facebook-js-sdk';
import ImgCrop from "antd-img-crop";

const Posts = () => {

    const [addPostForm] = Form.useForm();
    const { fbData, currLongAccessToken, linkedinData, twitterData } = useSelector((state) => state.userData) ?? {};
    const [imageFile, setImageFile] = useState(null);
    const [uploadFileList, setUploadFileList] = useState([]);
    const [imagesToDeleted, setImagesToDeleted] = useState([]);
    const [blobURL, setBlobURL] = useState(null);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);
    const [imageShown, setImageShown] = useState(false);
    const [showAdjustment, setShowAdjustment] = useState(false);
    const [showIcon, setShowIcon] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);
    const [adjustmentType, setAdjustmentType] = useState('brightness');
    const [editedBlobURL, setEditedBlobURL] = useState(null);
    const [showDoneButton, setShowDoneButton] = useState(false);

    const showDeleteConfirm = (record) => {
        Modal.confirm({
            title: `Attachment name: ${record.name} `,
            content: 'Are you sure you want to remove this attachment?',
            okText: 'Remove',
            okType: 'danger',
            onOk: async () => {
                // try {
                //   const res = await deleteProjectDocument(record._id);
                //   if (res.data?.success) {
                //     message.success(record.name + ' Attachment Removed');
                //   } else {
                //     message.error(res.data?.message);
                //   }
                // } catch (error) {
                //   message.error('Something went wrong' + error);
                // }
            },
            onCancel() { },
        });
    };

    const uploadProps = {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
            authorization: 'authorization-text',
        },

        onRemove: async (info) => {
            if (info?.url) {
                let tempPath = (info.url).split('images')[1];
                setImagesToDeleted([...imagesToDeleted, tempPath]);
                showDeleteConfirm();
            }
        },

        onChange(info) {
            if (info.file.status !== 'uploading') {
                info.file.status = 'done';
            }

            let newFileList = info.fileList;
            // if (newFileList.length > 0 && uploadFileList.length < 4) {
            if (newFileList.length > 0) {
                let temp = [];
                for (let i = 0; i < newFileList.length; i++) {
                    const el = newFileList[i];
                    if (el.originFileObj) {
                        temp.push(el.originFileObj);
                    } else {
                        temp.push(el);
                    }
                }
                setUploadFileList(temp);
                setImageFile(temp);
                // setIsImageUploaded(true);
                // setModalVisible(true);
                // setUploadedImageUrl(URL.createObjectURL(temp[0]));
                setImageShown(true);
                setShowIcon(true);
                setBrightness(100);
                setContrast(100);
                setSaturation(100);
                setAdjustmentType('brightness');
            } else {
                // message.error('Maximum 3 Images.');
            }
        },
    };

    // Convert Image file to Blob Url
    const fileToBlobURL = (file) => {
        return URL.createObjectURL(file);
    };

    const beforeUploadHandler = (file) => {
        setImageFile(file);
        const url = fileToBlobURL(file);
        setBlobURL(url);
        return false;
    };

    const blobToImage = (binaryUrl) => {
        var canvas = document.createElement("canvas")
        var img = document.createElement('img');
        img.src = binaryUrl;
        var context = canvas.getContext("2d")
        context.drawImage(img, 0, 0);
        return canvas.toDataURL();
    };

    const handleAddPostFormValues = async (form) => {
        const { imageUpload, postDescription, postAccounts } = form.getFieldsValue();
        // postContent, postAccountList
        if (postDescription && postAccounts?.length > 0) {
            if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
                return;
            }
            let dUrl = '';
            // let tempPostUrl = 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
            let tempPostUrl = 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
            let checkIsPosts = { isFbError: true, isIgError: true, isLkError: true, isTwtError: true };

            // let dataUrl = blobToImage(blobURL);
            // console.log(dataUrl);

            let formData = new FormData();

            formData.append('postContent', postDescription ? postDescription : '');
            formData.append('postAccountList', postAccounts);
            // formData.append('post', JSON.stringify(imageUpload?.file));

            if (fbData && fbData.accessToken && postAccounts.includes('facebook')) {
                let tempPageAccess = null;
                if (!fbData.pageAccess) {
                    const result = await getFbPageAccessToken({
                        accessToken: fbData.accessToken,
                        longAccessToken: currLongAccessToken.data.access_token,
                        userId: process.env.REACT_APP_FB_APP_ID,
                        appSecret: process.env.REACT_APP_FB_APP_SECRET
                    });
                    tempPageAccess = { ...result.data };
                    // setPageAccessToken(result.data);
                    localStorage.setItem('fbPageAccess', JSON.stringify(result.data));
                }

                const postShare = await sharePagePost({
                    pageAccessToken: fbData?.pageAccess ? fbData.pageAccess.data.data[0].access_token : tempPageAccess.data.data[0].access_token,
                    url: tempPostUrl,
                    content: postDescription,
                    pageId: fbData?.pageAccess ? fbData.pageAccess.data.data[0].id : tempPageAccess.data.data[0].id
                });
                if (postShare.status === 200) {
                    checkIsPosts.isFbError = false;
                } else message.error('Something went wrong in Facebook!');
            }

            if (postAccounts.includes('instagram')) {
                const res = await getIGPageAccessAndPost({
                    longAccessToken: currLongAccessToken.data.access_token,
                    accessToken: fbData.accessToken,
                    content: postDescription,
                    url: tempPostUrl,
                    userId: process.env.REACT_APP_FB_APP_ID,
                    appSecret: process.env.REACT_APP_FB_APP_SECRET
                });
                if (res.status === 200) {
                    checkIsPosts.isIgError = false;
                } else message.error('Something went wrong in Instagram!');
            }

            if (postAccounts.includes('linkedin') && linkedinData) {
                formData.append('description', postDescription ? postDescription : '');
                formData.append('accessToken', linkedinData.data.access_token);
                // formData.append('accessToken', linkedinData.data.id_token);
                formData.append('url', tempPostUrl);
                formData.append('image', imageUpload.file);

                const res = await shareLinkedinPost(formData);
                if (res.status === 200) {
                    // message.success('Post Shared in linkedin successfully.');
                    checkIsPosts.isLkError = false;
                } else message.error('Something went wrong in linkedin!');
            }

            if (postAccounts.includes('twitter') && twitterData) {

                formData.append('content', postDescription ? postDescription : '');
                formData.append('accessToken', twitterData.oauth_token);
                formData.append('accessSecret', twitterData.oauth_token_secret);
                formData.append('consumerKey', 'diOfW1TThaZJSrAexO2KqQ5Lx');
                formData.append('consumerSecret', 'zhWIX8VICHOI3o1fd4rSVR1KFGycY63J7RzlrvmfXGvicuEPl7');
                formData.append('imageUrl', tempPostUrl);
                // formData.append('image', JSON.stringify(imageUpload.file));
                formData.append('image', JSON.stringify({
                    uid: imageFile[0].uid,
                    name: imageFile[0].name,
                    size: imageFile[0].size,
                    type: imageFile[0].type,
                    lastModified: imageFile[0].lastModified,
                    lastModifiedDate: imageFile[0].lastModifiedDate
                }));

                const res = await shareTwitterPost(formData);
                if (res.status === 200) {
                    checkIsPosts.isTwtError = false;
                } else message.error('Something went wrong in Twitter!');
            }
        }
    };

    const handleIconClick = () => {
        setShowAdjustment(!showAdjustment);
        setButtonClicked(true);
        setShowDoneButton(true);
    };

    // Get the Adjustment values using Slider
    const handleSliderChange = (value) => {
        if (adjustmentType === 'brightness') {
            setBrightness(value);
        } else if (adjustmentType === 'contrast') {
            setContrast(value);
        } else if (adjustmentType === 'saturation') {
            setSaturation(value);
        }
    };

    const handleButtonClick = (type) => {
        setAdjustmentType(type);
    };

    // Set the Edited Blob Url using Adjustment values
    const handleImage = () => {
        if (!blobURL) return;

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const image = new Image();

        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            context.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
            context.drawImage(image, 0, 0);
            canvas.toBlob((blob) => {
                const adjustedBlobURL = URL.createObjectURL(blob);
                setEditedBlobURL(adjustedBlobURL);
            });
        };

        image.src = blobURL;
        setShowAdjustment(false);
        setShowDoneButton(false);
        handleAddPostFormValues(addPostForm);
    };

    return (
        <div className='postsDetails mainInsideDiv'>
            <br />
            {/* <Card className='card'>
                <Row align='middle' justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    </Col>
                </Row>
            </Card><br /> */}
            <h2>Import Post</h2><br />

            <Form
                form={addPostForm}
                name='addPostForm'
            >
                <div className='postsDetails'>
                    <Card className='card'>
                        {showIcon && (
                            <div className={`Finetune ${showAdjustment ? 'active' : ''}`} onClick={handleIconClick}>
                                <UnorderedListOutlined className={`logo ${buttonClicked ? 'clicked' : ''}`} /> {/* Apply 'clicked' class if buttonClicked state is true */}
                                <p className='adjustment'>Adjustment</p>
                            </div>
                        )}
                        <Row align='middle' justify='center'>
                            <Form.Item name='imageUpload' rules={[{ required: true, message: 'Upload Post is required' }]}>
                                <ImgCrop
                                    showGrid rotationSlider aspectSlider showReset beforeCrop
                                    modalOk=''
                                >
                                    <Upload {...uploadProps} beforeUpload={beforeUploadHandler}>
                                        {blobURL ? (
                                            <div className="image-gallery">
                                                <div className='image-wrapper'>
                                                    <img
                                                        src={blobURL}
                                                        alt="Uploaded"
                                                        className='image-style'
                                                        style={{ filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)` }}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <Button
                                                    className='appButton uploadPostBtn'
                                                    type='dashed'
                                                    label='Choose Image'
                                                />
                                            </div>
                                        )}
                                    </Upload>
                                </ ImgCrop>
                            </Form.Item>
                        </Row>
                        {showAdjustment && (
                            <div className='showAdjustment' style={{ display: imageShown ? 'block' : 'none' }}>
                                <div>
                                    <h2>Adjustment</h2>
                                    <Slider min={0} max={200} value={adjustmentType === 'brightness' ? brightness : adjustmentType === 'contrast' ? contrast : saturation} onChange={handleSliderChange} />
                                    <div className='slider-value'>
                                        <p className='num-left'>0</p>
                                        <p className='num-right'>{adjustmentType === 'brightness' ? brightness : adjustmentType === 'contrast' ? contrast : saturation}</p>
                                    </div>
                                    <div className='slider'>
                                        <div
                                            onClick={() => handleButtonClick('brightness')}
                                            className={`adjustmentButton ${adjustmentType === 'brightness' ? 'active' : ''}`}
                                            label='Brightness'
                                            style={{ backgroundColor: adjustmentType === 'brightness' ? '' : '' }}
                                        >
                                            Brightness
                                        </div>
                                        <div
                                            onClick={() => handleButtonClick('contrast')}
                                            className={`adjustmentButton ${adjustmentType === 'contrast' ? 'active' : ''}`}
                                            label='Contrast'
                                            style={{ backgroundColor: adjustmentType === 'contrast' ? '' : '' }}
                                        >
                                            Contrast
                                        </div>
                                        <div
                                            onClick={() => handleButtonClick('saturation')}
                                            className={`adjustmentButton ${adjustmentType === 'saturation' ? 'active' : ''}`}
                                            label='Saturation'
                                            style={{ backgroundColor: adjustmentType === 'saturation' ? '' : '' }}
                                        >
                                            Saturation
                                        </div>
                                        {/* <div
                                            onClick={() => handleButtonClick('temperature')}
                                            className={`adjustmentButton ${adjustmentType === 'temperature' ? 'active' : ''}`}
                                            label='Temperature'
                                            style={{ backgroundColor: adjustmentType === 'temperature' ? '' : '' }}
                                        >
                                            Temperature
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        )}
                        {showDoneButton && (
                            <Button className='done' onClick={handleImage} label='Done' style={{ display: imageShown ? 'block' : 'none' }} />
                        )}
                    </Card><br />

                    <Card className='upload-post'>
                        <Row align='middle' justify='space-between'>
                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                <h3>Add Caption</h3>
                            </Col>
                        </Row><br />
                        <Row justify='space-between'>
                            <Col xl={10} lg={10} md={10} sm={10} xs={10}>
                                <Form.Item
                                    name="postDescription"
                                    className="createUserTextInput minWidthLabel"
                                    type='text'
                                    required={false}
                                    requiredMsg='Description is required'
                                    max={40}
                                    maxMsg="cannot be longer than 40 characters"
                                    typeMsg="Enter a valid Description!"
                                    label="Description"
                                >
                                    <TextArea rows={2} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col xl={13} lg={13} md={13} sm={13} xs={13}>
                                <Form.Item
                                    name="postAccounts"
                                    label='Select an account:'
                                    // required
                                >
                                    <Checkbox.Group
                                        options={postAccounts}
                                        requiredMsg='Account is required'
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row align='middle' justify='space-between'>
                            <Col xl={24} lg={24} md={24} sm={24} xs={24} className='textAlignEnd'>
                                <Button
                                    onClick={() => {
                                        handleAddPostFormValues(addPostForm);
                                    }}
                                    className={`appButton addPostBtn ${buttonClicked ? 'clicked' : ''}`}
                                    label='Share Post'
                                />
                            </Col>
                        </Row>
                    </Card>
                </div>
            </Form>

            {/* <div>
                {imageChunks.map((chunk, rowIndex) => (
                    <>
                        <Row key={rowIndex} align='top' justify='space-between'>
                            {chunk.map((image, colIndex) => (
                                <Col key={colIndex} xl={4} lg={4} md={4} sm={4} xs={4}>
                                    <Card
                                        hoverable
                                        className='cardPost'
                                        cover={<Image alt={image?.imgAlt} src={image?.imgSrc} height='15rem' />}
                                    >
                                        <Meta title="MA" description={image?.imgDescription} />
                                    </Card>
                                </Col>
                            ))}
                        </Row><br /><br />
                    </>
                ))}
            </div> */}

        </div>
    );
}

export default Posts;