import React from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";
import useUserData from "../../plugin/useUserData";
import apiInstance from "../../utils/axios";
import Moment from "../../plugin/Moment";
import { useState } from "react";
import { useEffect } from "react";
import Toast from "../../plugin/Toast";


function Profile() {

    const [profileData, setProfileData] = useState({
        image: null,
        full_name: "",
        about: "",
        bio: "",
        country: "",
    });
    const [imagePreview, setImagePreview] = useState("");
    const user_id = useUserData()?.user_id;

    const fetchProfile = () => {
        apiInstance.get(`user/profile/${user_id}/`).then((profile_res) => {
            setProfileData(profile_res.data);
        });
        // this is the same as:
        // const noti_res = await apiInstance.get(`author/dashboard/noti-list/${user_id}/`);
        // setNoti(noti_res.data);
    };

    // image change
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setProfileData({
            ...profileData,
            // the name will be image, as it is set in the useState
            [event.target.name]: selectedFile,
        });

        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result)
        };

        if (selectedFile){
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleProfileChange = (event) => {
        setProfileData({
            ...profileData,
            [event.target.name]: event.target.value,
        })
    }

    const handleFormSubmit = async () => {
        const response = await apiInstance.get(`user/profile/${user_id}/`);
        const formdata = new FormData();

        // checks if the image is not the same as the one from the database (meaning we have selected a new one)
        if(profileData.image && profileData.image !== response.data.image) {
            formdata.append("image", profileData.image);
        };

        formdata.append("full_name", profileData.full_name);
        formdata.append("about", profileData.about);
        formdata.append("country", profileData.country);
        formdata.append("bio", profileData.bio);

        try {
            const res = await apiInstance.patch(`user/profile/${user_id}/`, formdata, {
                // when passing an image need this header!
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            Toast("success", "Profile updated successfully");
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <>
            <Header />
            <section className="pt-5 pb-5">
                <div className="container">
                    <div className="row mt-0 mt-md-4">
                        <div className="col-lg-12 col-md-8 col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="mb-0">Profile Details</h3>
                                    <p className="mb-0">You have full control to manage your own account setting.</p>
                                </div>
                                <div className="card-body">
                                    <div className="d-lg-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center mb-4 mb-lg-0">
                                            <img src={imagePreview || profileData?.image} id="img-uploaded" className="avatar-xl rounded-circle" alt="avatar" style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }} />
                                            <div className="ms-3">
                                                <h4 className="mb-0">Your avatar</h4>
                                                <p className="mb-0">PNG or JPG no bigger than 800px wide and tall.</p>
                                                <input type="file"  className="form-control mt-3" name="image" onChange={handleFileChange} id="" />
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="my-5" />
                                    <div>
                                        <h4 className="mb-0 fw-bold">
                                            <i className="fas fa-user-gear me-2"></i>Personal Details
                                        </h4>
                                        <p className="mb-4 mt-2">Edit your personal information and address.</p>
                                        <div className="row gx-3">
                                            <div className="mb-3 col-12 col-md-12">
                                                <label className="form-label" htmlFor="fname">
                                                    Full Name
                                                </label>
                                                <input onChange={handleProfileChange} name="full_name" type="text" id="fname" className="form-control" placeholder="What's your full name?" value={profileData?.full_name || ""} required="" />
                                                <div className="invalid-feedback">Please enter first name.</div>
                                            </div>
                                            <div className="mb-3 col-12 col-md-12">
                                                <label className="form-label" htmlFor="fname">
                                                    Bio
                                                </label>
                                                <input onChange={handleProfileChange} name="bio" type="text" id="fname" className="form-control" placeholder="Write a catchy bio!" value={profileData?.bio || ""} required="" />
                                                <div className="invalid-feedback">Please enter first name.</div>
                                            </div>
                                            <div className="mb-3 col-12 col-md-12">
                                                <label className="form-label" htmlFor="lname">
                                                    About Me
                                                </label>
                                                <textarea onChange={handleProfileChange} name="about" placeholder="Tell us about yourself..." id="" cols="30" rows="5" value={profileData?.about || ""} className="form-control"></textarea>
                                                <div className="invalid-feedback">Please enter last name.</div>
                                            </div>

                                            <div className="mb-3 col-12 col-md-12">
                                                <label className="form-label" htmlFor="editCountry">
                                                    Country
                                                </label>
                                                <input onChange={handleProfileChange} name="country" type="text" id="country" className="form-control" placeholder="What country are you from?" value={profileData?.country || ""} required="" />
                                                <div className="invalid-feedback">Please choose country.</div>
                                            </div>
                                            <div className="col-12 mt-4">
                                                <button onClick={handleFormSubmit} className="btn btn-primary" type="button">
                                                    Update Profile <i className="fas fa-check-circle"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default Profile;
