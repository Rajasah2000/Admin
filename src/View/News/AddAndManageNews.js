import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import PageLoader from "../../Loader/PageLoader";
import ImageLoader from "../../Loader/ImageLoader";
import HttpClientXml from "../../Utils/HttpClientXml";
import HomeService from "../../Service/HomeService";

const AddAndManageNews = () => {
  const [newsTitle, setNewsTitle] = useState("");
  const [description , setDescription] = useState("");
  const [newsCatID , setNewsCatID] = useState('');
  const [countryID , setCountryID] = useState('');
  const [image, setImage] = useState("");

  const [allNews, setAllNews] = useState([]);
  const [AllNewsCategoryData , setAllNewsCategoryData] = useState([]);
  const [countryData , setCountryData] = useState([]);
  const [id, setId] = useState("");
  const [hide, setHide] = useState(true);
  const [loader, setLoader] = useState(false);
  const [imageLoader, setImageLoader] = useState(false);

  console.log("dadaad",AllNewsCategoryData,countryData);

  useEffect(() => {
    fetchViewNews();
    fetchAllNewsCategoryData();
    fetchAllCountryData();
  }, []);

  const fetchAllNewsCategoryData= async () => {
    let res = await HomeService.ViewAllNewsCategory();
    if(res && res?.status){
        setAllNewsCategoryData(res?.data)
    }else{
        toast.error(res?.message)
    }
  }


  const fetchAllCountryData= async() => {
    let res =await HomeService.ViewAllCountry();
    if(res && res?.status){
        setCountryData(res?.data)
    }else{
        toast.error(res?.message)
    }
  }

  //for adding Learing Category
  const AddNews = async () => {
    let data = {
         newsCatID: newsCatID,
      description:description,
      newsTitle:newsTitle,
      countryID:countryID,
      image: image,
    };
    if (newsCatID && description && newsTitle && countryID && image) {
      const res = await HomeService.AddNews(data);
      if (res && res.status) {
        toast.success(res.message);
        setImage("");
        setNewsTitle("");
        setDescription("");
        setNewsCatID("");
        setCountryID("")
        fetchViewNews();
        let file = document.querySelector("#LearningCategory");
        file.value = "";
      } else {
        toast.error(res?.message);
      }
    } else {
      toast.error("Please fill all the fields");
    }
  };

  //for upload image
  const HandleImage = async (e) => {
    setImageLoader(true);
    let file = e.target.files[0];
    let data = new FormData();
    data.append("image", file);
    let res = await HttpClientXml.fileUplode("upload-Image", "POST", data);
    if (res && res.status) {
      // console.log("UploadImage", res);
      setImage(res?.url);
      setImageLoader(false);
    } else {
      toast.error(res?.message);
      setImageLoader(false);
    }
  };

  const HandleCrossClick = () => {
    setImage("");
    let file = document.querySelector("#LearningCategory");
    file.value = "";
  };

  //for view all Learning category
  const fetchViewNews = async () => {
    setLoader(true);
    const res = await HomeService.ViewAllNews();
    setAllNews(res?.data);
    if (res && res.data) {
      let arr = res?.data?.map((item, index) => {
        return {
          sl: index + 1,
          newsTitle: item?.newsTitle,
          description: item?.description,
          image: (
            <>
              {item?.image ? (
                <img
                  style={{
                    height: "29%",
                    width: "29%",
                    borderRadius: "9px",
                    margin: "5px",
                  }}
                  src={item?.image}
                />
              ) : (
                <img
                  style={{
                    height: "11%",
                    width: "11%",
                    borderRadius: "9px",
                    margin: "5px",
                  }}
                  src={
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"
                  }
                />
              )}
            </>
          ),
          action: (
            <div style={{ display: "flex", flexDirection: "coloum" }}>
              <svg
                onClick={() => onEdit(item)}
                style={{
                  height: "20px",
                  width: "20px",
                  cursor: "pointer",
                  marginRight: "20px",
                }}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-pencil-square"
                viewBox="0 0 16 16"
              >
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path
                  fill-rule="evenodd"
                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                />
              </svg>
              <svg
                onClick={() => onDelete(item?._id)}
                style={{
                  color: "red",
                  height: "20px",
                  cursor: "pointer",
                  width: "20px",
                }}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-trash3"
                viewBox="0 0 16 16"
              >
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
              </svg>
            </div>
          ),
        };
      });
      setAllNews(arr);
      setLoader(false);
    }
  };

  const columns = [
    {
      name: (
        <div
          style={{ fontSize: "14px", color: "#495057", fontWeight: "bolder" }}
        >
          SL
        </div>
      ),
      selector: (row) => row.sl,
    },
    {
      name: (
        <div
          style={{ fontSize: "14px", color: "#495057", fontWeight: "bolder" }}
        >
          News Title
        </div>
      ),
      selector: (row) => row.newsTitle,
    },
    {
      name: (
        <div
          style={{ fontSize: "14px", color: "#495057", fontWeight: "bolder" }}
        >
          Description
        </div>
      ),
      selector: (row) => row.description,
    },
    {
      name: (
        <div
          style={{ fontSize: "14px", color: "#495057", fontWeight: "bolder" }}
        >
          Image
        </div>
      ),
      selector: (row) => row.image,
    },

    {
      name: (
        <div
          style={{
            fontSize: "14px",
            color: "#495057",
            marginLeft: "15px",
            fontWeight: "bolder",
          }}
        >
          Action
        </div>
      ),
      selector: (row) => row.action,
    },
  ];



  //for delete particular learning category data
  const onDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        HomeService.DeleteNews(id)
          .then((res) => {
            if (res && res.status) {
              toast.success("Deleted Successfully");

              fetchViewNews();
            } else {
              toast.error(res?.message);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  //for get particular id and edit
  const onEdit = (item) => {
    window.scroll(0, 0);
    setImage(item?.image);
    setNewsTitle(item?.newsTitle);
    setDescription(item?.description);
    setNewsCatID(item?.newsCatID);
    setCountryID(item?.countryID);
    setId(item?._id);
    setHide(false);
  };

  //for update the data
  const UpdateNews = async() => {
    let data = {
    newsCatID: newsCatID,
     description:description,
     newsTitle:newsTitle,
     countryID:countryID,
     image: image,
   };
   if (newsCatID && description && newsTitle && countryID && image) {
     const res = await HomeService.UpdateNews(id ,data);
     if (res && res.status) {
       toast.success(res.message);
       setImage("");
       setNewsTitle("");
       setDescription("");
       setNewsCatID("");
       setCountryID("")
       fetchViewNews();
       let file = document.querySelector("#LearningCategory");
       file.value = "";
     } else {
       toast.error(res?.message);
     }
   } else {
     toast.error("Please fill all the fields");
   }
  };

  return (
    <>
      {loader ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <PageLoader />
        </div>
      ) : (
        <div component="div" className="TabsAnimation appear-done enter-done">
          <div className="main-card mb-3 card">
            <div className="card-body">
              {hide ? (
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "20px",
                    color: "#868e96",
                    margin: "35px",
                  }}
                  className="card-title"
                >
                  Add News
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "20px",
                    color: "#868e96",
                    margin: "35px",
                  }}
                  className="card-title"
                >
                  Edit News
                </div>
              )}

              <div class="form-group">
              <div class="row" style={{ marginBottom: "1rem" }}>
                    <div class="col">
                      <label for="inputEmail4">
                      News Title<span style={{ color: "red" }}>*</span> :
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        value={newsTitle}
                        onChange={(e) => setNewsTitle(e.target.value)}
                        placeholder="Enter news title..."
                      />
                    </div>

                    <div class="col">
                      <label for="inputEmail4">
                      Description<span style={{ color: "red" }}>*</span> :
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>

                  <div class="row" style={{ marginBottom: "1rem" }}>
                  <div class="col">
                    <label for="inputEmail4">
                      News Catagory<span style={{ color: "red" }}>*</span> :
                    </label>

                    <select
                      style={{ marginBottom: "21px" }}
                      class="form-select"
                      aria-label="select category"
                      value={newsCatID}
                      onChange={(e) => setNewsCatID(e?.target?.value)}
                    >
                      <option value={""}>Select a news category.......</option>
                      {AllNewsCategoryData?.map((item) => {
                        return (
                          <option id={item?._id} value={item?._id}>
                            {item?.newsCatName}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div class="col">
                    <label for="inputEmail4">
                      Country Name<span style={{ color: "red" }}>*</span> :
                    </label>

                    <select
                      style={{ marginBottom: "21px" }}
                      class="form-select"
                      aria-label="select category"
                      value={countryID}
                      onChange={(e) => setCountryID(e?.target?.value)}
                    >
                      <option value={""}>Select a category name.......</option>
                      {countryData.map((item) => {
                        return (
                          <option id={item?._id} value={item?._id}>
                            {item?.countryName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>


                <label for="exampleInputEmail1">
                  Image<span style={{ color: "red" }}>*</span> :
                </label>

                <input
                  class="form-control"
                  onChange={(e) => HandleImage(e)}
                  type="file"
                  id="LearningCategory"
                  accept="image/*"
                />
              </div>
              {imageLoader ? (
                <>
                  <ImageLoader />{" "}
                </>
              ) : null}

              {image && (
                <>
                  <div>
                    <img
                      style={{
                        height: "10%",
                        width: "10%",
                        marginTop: "12px",
                        borderRadius: "5px",
                      }}
                      src={image}
                    />
                    <button
                      onClick={() => HandleCrossClick()}
                      style={{ color: "red" }}
                      type="button"
                      class="btn-close"
                      aria-label="Close"
                    ></button>
                  </div>
                </>
              )}

              {hide ? (
                <button
                  class="btn btn-primary"
                  onClick={AddNews}
                  style={{ marginTop: "1rem" }}
                >
                  Submit
                </button>
              ) : (
                <button
                  class="btn btn-primary"
                  onClick={UpdateNews}
                  style={{ marginTop: "1rem" }}
                >
                  Update
                </button>
              )}
              {/* <button class="btn btn-primary" onClick={AddCategory} >
                Submit
              </button> */}

              {/* <button class="btn btn-primary" onClick={UpdateLearningCategory}>
            Update
          </button> */}

              <div
                style={{
                  textAlign: "center",
                  fontSize: "20px",
                  color: "#868e96",
                  margin: "35px",
                }}
                className="card-title"
              >
                Manage News
              </div>

              <DataTable
                columns={columns}
                data={allNews}
                pagination
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};


export default AddAndManageNews