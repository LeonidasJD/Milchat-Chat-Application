import "./profile.scss";
import { useSelector } from "react-redux";
import useProfile from "./useProfile.ts";
import { RootState } from "../../../redux/store.ts";
import Button from "../../common/button.tsx";
import { formatDate, formatDateTime } from "../../../utils/dateFormat.ts";
import GlobalModal from "../../common/global-modal/globalModal.tsx";
import { Controller } from "react-hook-form";
import { Input } from "antd";
import QrCode from "../../common/qr-code/qr-code.tsx";
import PageHeader from "../../common/page-header/page-header.tsx";
import GlobalLoader from "../../common/global-loader/global-loader.tsx";

const Profile = () => {
  const {
    updateUserProfile,
    modalOpen,
    handleOpenChangeProfileModal,
    handleCloseChangeProfileModal,
    handleOpenResetPasswordModal,
    handleCloseResetPasswordModal,
    resetPasswordModalOpen,
    controlChangeProfile,
    handleSubmitChangeProfile,
    errorsChangeProfile,
    controlResetPassword,
    handleSubmitResetPassword,
    errorsResetPassword,
    handleResetPassword,
    successResetPassword,
    handleDeleteUser,
    deleteUserModalOpen,
    handleOpenDeleteUserModal,
    handleCloseDeleteUserModal,
    isLoading,
  } = useProfile();

  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const firstLetter = currentUser?.userName
    ? currentUser.userName.charAt(0)
    : "";

  return (
    <>
      <PageHeader
        title="My Profile"
        backgroundColor="#2e1b3e"
        fontColor="white"
      />

      <div className="data-wrapper">
        {isLoading ? (
          <GlobalLoader />
        ) : (
          <>
            <div className="user-info">
              <div className="user-initial">
                <p>{firstLetter}</p>
              </div>

              <div>
                <div className="user-data">
                  <span>
                    Name:{" "}
                    <p>
                      {" "}
                      {currentUser?.userName
                        ? currentUser.userName
                        : "Not set yet"}
                    </p>
                  </span>
                  <span>
                    Email: <p> {currentUser?.email}</p>
                  </span>
                  <span>
                    Verified Email:{" "}
                    <p> {currentUser?.emailVerified ? "Yes" : "No"}</p>
                  </span>
                  <span>
                    User Created:{" "}
                    <p>
                      {" "}
                      {formatDate(currentUser?.metadata?.creationTime ?? "")}
                    </p>
                  </span>
                  <span>
                    Last Signed In:{" "}
                    <p>
                      {" "}
                      {formatDateTime(
                        currentUser?.metadata?.lastSignInTime ?? ""
                      )}
                    </p>
                  </span>
                </div>
              </div>
            </div>

            <div className="edit-button">
              <div className="qrCodeWrapper">{<QrCode />}</div>
              <Button
                onClick={() =>
                  handleOpenChangeProfileModal(currentUser?.userName ?? "")
                }
                color="dark"
                text="Change Profile Name"
              ></Button>
              <Button
                onClick={handleOpenResetPasswordModal}
                color="dark"
                text="Change Password"
              ></Button>
              <Button
                onClick={handleOpenDeleteUserModal}
                color="dark"
                text="Delete User"
              ></Button>
            </div>
          </>
        )}
      </div>
      {/* CHANGE PROFILE NAME MODAL START */}

      <GlobalModal
        title="Change Profile Name"
        isModalOpen={modalOpen}
        handleCancel={() => {
          handleCloseChangeProfileModal();
        }}
      >
        <form onSubmit={handleSubmitChangeProfile(updateUserProfile)}>
          <label className="login-label">New Profile Name</label>
          <Controller
            name="name"
            control={controlChangeProfile}
            rules={{
              required: "Name is required*",
              pattern: {
                value: /^.{0,30}$/,
                message: "Input must be between 0 and 30 characters long.",
              },
            }}
            render={({ field }) => (
              <Input
                type="text"
                placeholder="Enter your profile name"
                {...field}
              />
            )}
          />
          {errorsChangeProfile?.name && (
            <span className="error-message">
              {String(errorsChangeProfile.name.message)}
            </span>
          )}
          <Button type="submit" color="dark" text="Update Profile" />
        </form>
      </GlobalModal>
      {/* CHANGE PROFILE NAME MODAL END */}

      {/* CHANGE PASSWORD MODAL START */}
      <GlobalModal
        title="Reset Password"
        isModalOpen={resetPasswordModalOpen}
        handleCancel={() => {
          handleCloseResetPasswordModal();
        }}
      >
        {!successResetPassword ? (
          <form onSubmit={handleSubmitResetPassword(handleResetPassword)}>
            <label className="login-label">Reset Password</label>

            <Controller
              name="email"
              control={controlResetPassword}
              rules={{
                required: "Email is required*",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Incorrect email address",
                },
              }}
              render={({ field }) => (
                <Input
                  type="email"
                  placeholder="Enter registered email address"
                  {...field}
                />
              )}
            />
            {errorsResetPassword?.email && (
              <span className="error-message">
                {String(errorsResetPassword.email.message)}
              </span>
            )}
            <Button type="submit" color="dark" text="Reset Password" />
          </form>
        ) : (
          <div>
            <p style={{ color: "#2e1b3e" }}>
              Password reset email sent. Check your email!
            </p>
            <Button
              onClick={handleCloseResetPasswordModal}
              color="dark"
              text="Close"
            />
          </div>
        )}
      </GlobalModal>

      {/* CHANGE PASSWORD MODAL END */}

      {/* DELETE USER MODAL START  */}

      <GlobalModal
        title="Delete User"
        isModalOpen={deleteUserModalOpen}
        handleCancel={handleCloseDeleteUserModal}
      >
        <div>
          <p style={{ color: "#2e1b3e" }}>
            Are you sure you want to delete your account?
          </p>
          <div className="delete-user-buttons">
            <Button
              onClick={handleDeleteUser}
              color="dark"
              text="Delete User"
            ></Button>
            <Button
              onClick={handleCloseDeleteUserModal}
              color="dark"
              text="Cancel"
            ></Button>
          </div>
        </div>
      </GlobalModal>

      {/* DELETE USER MODAL END */}
    </>
  );
};

export default Profile;
