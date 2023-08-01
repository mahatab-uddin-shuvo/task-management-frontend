import React, { useState, useEffect } from "react";
import { useForm, setValue } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Modal,
  Toast,
  Badge,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import http from "../../http";
import { GrStatusInfo, GrView } from "react-icons/gr";
import { AiTwotoneEdit } from "react-icons/ai";
import DataTable from "react-data-table-component";
import Layout from "../../components/layouts/layout";
import loginCheck from "../../helpers/loginCheck";
import Cookies from "universal-cookie";
import { RadioGroup, Radio , ButtonToolbar,Modal as ModalRsuite, Button as ButtonRsuite} from "rsuite";
import { TiTickOutline } from "react-icons/ti";
import moment from 'moment/moment';


const TaskCreation = () => {
  const [show, setShow] = useState(false);
  const [id, setId] = useState("");
  const { register, handleSubmit } = useForm();
  const [search, setSearch] = useState("");
  const [filterTaskCreation, setFilterTaskCreation] = useState([]);
  const [getState, setState] = useState();
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [pages, setPages] = useState();
  const [getCurrentPage, setCurrentPage] = useState();
  const [getStatus, setStatus] = useState(false);
  const [getStatusMsg, setStatusMsg] = useState();
  const [getDescription, setDescription] = useState();

  const [open, setOpen] = useState(false);
  const handleOpen = (val) => {
    setOpen(true);
    setDescription(val)
  }
  const handleClose1 = () => setOpen(false);

  const cookies = new Cookies();

  const navigate = useNavigate();
  useEffect(() => {
    if (!loginCheck()) {
      navigate("/login");
    }
  });

  const handleClose = () => setShow(false);

  const handleShow = (id, status) => {
    setShow(true);
    setId(id);
    setState(status.toString());
  };


//search api call and list api call coinditionally

  useEffect(() => {
    fetchAllTaskAssign(getCurrentPage);
  }, [getStatus]);

  useEffect(() => {
    let query = search.length > 1 ? `searchAll/${search}` : `list`;

    http
      .get(
        `/task/${query}?limit=${perPage}&page=${pages}&per_page=${perPage}&delay=1`,
        {
          headers: {
            Authorization: "Bearer " + cookies.get("userAuth").token,
          },
        }
      )
      .then((response) => {
        setTotalRows(response.data.data.total);
        setFilterTaskCreation(response.data.data.data);
      });
  }, [search]);


  // list api call
  const fetchAllTaskAssign = async (page) => {
    setCurrentPage(page);
    setLoading(true);
    setPages(page);
    const response = await http.get(
      `/task/list?limit=${perPage}&page=${pages}&per_page=${perPage}&delay=1`,
      {
        headers: {
          Authorization: "Bearer " + cookies.get("userAuth").token,
        },
      }
    );
    setFilterTaskCreation(response.data.data.data);
    setTotalRows(response.data.data.total);
    setLoading(false);
  };


  // data pagination with search api call
  const handlePageChange = async (page) => {
    setCurrentPage(page);

    let query = search.length > 2 ? `searchAll/${search}` : `list`;

    setLoading(true);
    const response = await http.get(
      `/task/${query}/?limit=${perPage}&page=${page}&per_page=${perPage}&delay=1`,
      {
        headers: {
          Authorization: "Bearer " + cookies.get("userAuth").token,
        },
      }
    );
    setFilterTaskCreation(response.data.data.data);
    setPerPage(perPage);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllTaskAssign(1); // fetch page 1 of Task Creation
  }, []);

//status api call
  const activeStatus = (id, val) => {
    console.log(id,val)
    var data = {
      status: val,
    };

    http
      .post("/task/status/" + id, data, {
        headers: {
          Authorization: "Bearer " + cookies.get("userAuth").token,
        },
      })
      .then((res) => {
        console.log(res);
        setStatus(true);
        setStatusMsg(res?.data?.message);
        setTimeout(() => {
          setStatus(false);
        }, 2000);
      });
    handleClose();
  };


//data table 
  const columns = [
    {
      name: "#",
      cell: (row, index) => (getCurrentPage - 1) * perPage + (index + 1), //RDT provides index by default
      width: "50px",
    },
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Duration",
      selector: (row) => moment(row?.duration).format('MMMM Do YYYY, h:mm:ss a'),
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => 
      <ButtonToolbar>
        <ButtonRsuite size="sm" color="violet" appearance="subtle" onClick={(e) => handleOpen(row.description)}>{row?.description.slice(0, 20)}</ButtonRsuite>
      </ButtonToolbar>,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) =>
        row.status == "Done" ? (
          <h6>
            <Badge bg="success" text="light" fontSize="12px">
              {row.status}
            </Badge>
          </h6>
        ) : row.status == "In-progress" ? (
          <h6>
            <Badge bg="warning" text="dark">
              {row.status}
            </Badge>
          </h6>
        ) : (
          <h6>
            <Badge bg="primary" text="light">
              {row.status}
            </Badge>
          </h6>
        ),

      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>

            <Link to={"edit/" + row.id}>
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip id={`tooltip-bottom`}>
                    <strong>Edit</strong>
                  </Tooltip>
                }
              >
                <Button className="action__btn" variant="primary">
                  <AiTwotoneEdit />
                </Button>
              </OverlayTrigger>
            </Link>


          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id={`tooltip-bottom`}>
                <strong>Status</strong>
              </Tooltip>
            }
          >
            <Button
              className="action__btn"
              onClick={() => handleShow(row.id, row.status)}
              variant="warning"
            >
              <GrView />
            </Button>
          </OverlayTrigger>

        </>
      ),
    },
  ];

  return (
    <>
      <Layout>
        {getStatus ? (
          <Toast
            bg="success"
            style={{
              position: "fixed",
              top: "30px",
              right: "0",
              zIndex: "111111",
            }}
          >
            <Toast.Body>{getStatusMsg}</Toast.Body>
          </Toast>
        ) : null}

          <Link to="create">
            <Button className="create_btn btn btn-primary" variant="primary">
              Add Task Creation
            </Button>
          </Link>

        <DataTable
          title="Task Creation"
          columns={columns}
          data={filterTaskCreation}
          progressPending={loading}
          pagination
          paginationServer
          paginationComponentOptions={{ noRowsPerPage: true }}
          paginationTotalRows={totalRows}
          onChangePage={handlePageChange}
          fixedHeader
          fixedHeaderScrollHeight="800px"
          highlightOnHover
          subHeader
          subHeaderComponent={
            <input
              type="text"
              placeholder="Search Here"
              className="search_btn form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          }
          subHeaderAlign="right"
        />

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Are you sure?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="p-2">Status</p>
            <RadioGroup
              name="radioList"
              inline
              onChange={(value) => setState(value)}
              defaultValue={getState}
            >
              <Radio value="Open">Open</Radio>
              <Radio value="In-progress">In-progress</Radio>
              <Radio value="Done">Done</Radio>
            </RadioGroup>
          </Modal.Body>
          <Modal.Footer>
            <Link to="/task-creation">
              <Button
                className="action__btn"
                variant="secondary"
                onClick={handleClose}
              >
                Close
              </Button>
              <Button
                className="action__btn"
                onClick={() => activeStatus(id, getState)}
                variant="danger"
              >
                Update
              </Button>
            </Link>
          </Modal.Footer>
        </Modal>

        <ModalRsuite
          backdrop="static"
          role="alertdialog"
          open={open}
          onClose={handleClose}
          size="xs"
        >
          <Modal.Body>
            <TiTickOutline
              style={{ color: "#128a00", fontSize: 24 }}
            />
            {getDescription}
          </Modal.Body>
          <Modal.Footer>
            <ButtonRsuite onClick={handleClose1} appearance="primary">
              Ok
            </ButtonRsuite>
          </Modal.Footer>
        </ModalRsuite>
      </Layout>
    </>
  );
};

export default TaskCreation;
