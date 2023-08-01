import React, { useState, useEffect } from "react";
import { useForm, setValue } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Badge,
} from "react-bootstrap";
import http from "../../http";

import DataTable from "react-data-table-component";
import Layout from "../../components/layouts/layout";
import loginCheck from "../../helpers/loginCheck";
import Cookies from "universal-cookie";
import moment from 'moment/moment';


const TaskAssignment = () => {
  const { register, handleSubmit } = useForm();
  const [search, setSearch] = useState("");
  const [filterTaskAssign, setFilterTaskAssign] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [pages, setPages] = useState();
  const [getCurrentPage, setCurrentPage] = useState();

  const cookies = new Cookies();

  const navigate = useNavigate();
  useEffect(() => {
    if (!loginCheck()) {
      navigate("/login");
    }
  });


//search api call and list api call coinditionally
  useEffect(() => {
    fetchAllTaskAssign(getCurrentPage);
  }, []);

  useEffect(() => {
    let query = search.length > 1 ? `searchAll/${search}` : `list`;

    http
      .get(
        `/task-assignment/${query}?limit=${perPage}&page=${pages}&per_page=${perPage}&delay=1`,
        {
          headers: {
            Authorization: "Bearer " + cookies.get("userAuth").token,
          },
        }
      )
      .then((response) => {
        setTotalRows(response.data.data.total);
        setFilterTaskAssign(response.data.data.data);
      });
  }, [search]);


  // list api call
  const fetchAllTaskAssign = async (page) => {
    setCurrentPage(page);
    setLoading(true);
    setPages(page);
    const response = await http.get(
      `/task-assignment/list?limit=${perPage}&page=${pages}&per_page=${perPage}&delay=1`,
      {
        headers: {
          Authorization: "Bearer " + cookies.get("userAuth").token,
        },
      }
    );
    setFilterTaskAssign(response.data.data.data);
    setTotalRows(response.data.data.total);
    setLoading(false);
  };


  // data pagination with search api call
  const handlePageChange = async (page) => {
    setCurrentPage(page);

    let query = search.length > 2 ? `searchAll/${search}` : `list`;

    setLoading(true);
    const response = await http.get(
      `/task-assignment/${query}/?limit=${perPage}&page=${page}&per_page=${perPage}&delay=1`,
      {
        headers: {
          Authorization: "Bearer " + cookies.get("userAuth").token,
        },
      }
    );
    setFilterTaskAssign(response.data.data.data);
    setPerPage(perPage);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllTaskAssign(1); // fetch page 1 of task assign
  }, []);

  // +++++++++++++++++++

  //datable column with value
  const columns = [
    {
      name: "#",
      cell: (row, index) => (getCurrentPage - 1) * perPage + (index + 1), //RDT provides index by default
      width: "50px",
    },
    {
      name: "Assignee",
      selector: (row) => row.assigne && row.assigne,
      sortable: true,
    },
    {
      name: "Title",
      selector: (row) => row.title && row.title,
      sortable: true,
    },
    {
      name: "Assign For",
      selector: (row) => row.assignFor && row.assignFor,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) =>
          row?.status == "Done" ? (
            <h6>
              <Badge bg="success" text="light">
                {row.status}
              </Badge>
            </h6>
        ) : row?.status == "In-progress" ? (
          <h6>
            <Badge bg="warning" text="dark">
              {row.status}
            </Badge>
          </h6>
        ) : (
          <h6>
            <Badge bg="primary" text="light">
              {row?.status}
            </Badge>
          </h6>
        ),

      sortable: true,
    },
    {
      name: "Duration",
      selector: (row) => moment(row?.duration).format('MMMM Do YYYY, h:mm:ss a'),
      sortable: true,
    },
  ];

  return (
    <>
      <Layout>
          <Link to="create">
            <Button className="create_btn btn btn-primary" variant="primary">
              Add Task Assignment
            </Button>
          </Link>

        <DataTable
          title="Task Assignment"
          columns={columns}
          data={filterTaskAssign}
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
      </Layout>
    </>
  );
};

export default TaskAssignment;
