import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Alarms from "../AlertsAlarmsFaults/Alarms";

const AlarmsDailog = ({ id, openDialog, closeDialog }) => {
  return (
    <Modal
      size="lg"
      style={{ marginTop: "80px" }}
      show={openDialog}
      onHide={() => closeDialog(false)}
    >
      <Modal.Header style={{ display: "flex", justifyContent: "flex-end" }}>
        <div>
          <CloseIcon
            style={{
              cursor: "pointer",
              color: "white",
              backgroundColor: "orange",
              margin: "5px",
              fontSize: "28px",
            }}
            onClick={closeDialog}
          />
        </div>
      </Modal.Header>
      <Modal.Body>
        <Alarms id={id} />
      </Modal.Body>
      <Modal.Footer style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={() => closeDialog(false)}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AlarmsDailog;
