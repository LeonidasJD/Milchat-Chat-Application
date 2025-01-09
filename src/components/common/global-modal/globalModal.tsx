import React from "react";
import { Modal } from "antd";

interface GlobalModalProps {
  isModalOpen: boolean;
  handleCancel: () => void;
  children: React.ReactNode;
  title: string;
}

const GlobalModal: React.FC<GlobalModalProps> = ({
  children,
  isModalOpen,
  title,
  handleCancel,
}) => {
  return (
    <>
      <Modal
        centered
        title={title}
        footer={null}
        keyboard={true}
        open={isModalOpen}
        onCancel={handleCancel}
      >
        {children}
      </Modal>
    </>
  );
};

export default GlobalModal;
