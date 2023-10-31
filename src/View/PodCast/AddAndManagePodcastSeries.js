import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import HomeService from "../../Service/HomeService";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import ImageLoader from "../../Loader/ImageLoader";
import HttpClientXml from "../../Utils/HttpClientXml";

const INITIAL = {
  // podcastGenreID: "",
  moodID: [],
  contentType: "",
  podcastType: "",
  titleOfseries: "",
  seriesDescription: "",
  podcast: [{ episodeName: "", audioName: "", artistName: "", releaseYear: "", podcastDuration: "", addPodcast: "", uploadThumbload: "" }]
};
const AddAndManagePodcastSeries = () => {
  const [podcastData, setPodcastData] = useState(INITIAL);
  const [AllPodcastData, setAllPodcastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hide, setHide] = useState(true);
  const [catData, setCatData] = useState([]);
  const [genreData, setGenreData] = useState([]);
  const [moodData, setMoodData] = useState([]);
  // const [thumbnail, setThumbnail] = useState("");
  // const [podcastImage, setPodcastImage] = useState("")
  const [imageLoader, setImageLoader] = useState(false);
  const [imageLoader2, setImageLoader2] = useState(false);
  const [selectedPodcastId, setSelectedPodcastId] = useState(null);

  console.log("podcastData", podcastData);

  useEffect(() => {
    fetchAllPodcastData();
    fetchAllCategoryData();
    fetchAllGenreData();
    fetchAllMoodData();
  }, []);

  //for add all Podcast
  const AddPodcast = () => {
    let data = podcastData;
    console.log(data, "podcast");
    if (podcastData?.podcastCategoryID && podcastData?.podcastGenreID) {
      HomeService.AddPodcastSeries(data)
        .then((res) => {
          if (res && res.status) {
            toast.success(res.message);
            setPodcastData(INITIAL);
            fetchAllPodcastData();
          } else {
            toast.error(res?.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast.error("All fields are required");
    }

    console.log("GHGDK", podcastData);
  };


  //for delete functionality
  const onDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      // text: "You won't  to delete this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        HomeService.DeletePodcast(id)
          .then((res) => {
            if (res && res.status) {
              toast.success("Deleted Successfully");

              fetchAllPodcastData();
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

  // Update the podcast data
  const UpdatePodcast = () => {
    if (selectedPodcastId) {
      HomeService.UpdatePodcastSeries(selectedPodcastId, podcastData)
        .then((res) => {
          if (res && res.status) {
            toast.success(res.message);
            setPodcastData(INITIAL);
            setSelectedPodcastId(null); // Clear the selected podcast ID
            fetchAllPodcastData();
          } else {
            toast.error(res?.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast.error("Please select a podcast to update.");
    }
  };

  const onEdit = (podcast) => {
    window.scroll(0, 0);
    // setThumbnail(podcast?.uploadThumbnail);
    setHide(false);
    setSelectedPodcastId(podcast._id);
    setPodcastData({ ...podcast });
  };

  //handeling upload thumbnail
  const HandleImage = async (e) => {
    setImageLoader(true);
    let file = e.target.files[0];
    let data = new FormData();
    data.append("image", file);

    let res = await HttpClientXml.fileUplode("upload-Image", "POST", data);

    if (res && res.status) {
      console.log("UploadImage", res);
      // setThumbnail(res?.url);
      setPodcastData((prev) => ({ ...prev, uploadThumbload: res?.url }));
    } else {
      toast.error(res?.message);
    }
    setImageLoader(false);
  };

  //handeling Podcast image
  const HandlePodcastImage = async (e) => {
    setImageLoader2(true);
    let file = e.target.files[0];
    let data = new FormData();
    data.append("image", file);

    let res = await HttpClientXml.fileUplode("upload-Image", "POST", data);

    if (res && res.status) {
      console.log("UploadImage", res);
      // setPodcastImage(res?.url);
      setPodcastData((prev) => ({ ...prev, addPodcast: res?.url }));
    } else {
      toast.error(res?.message);
    }
    setImageLoader2(false);
  };

  //for cross button for upload thumbnail
  const HandleCrossClick = () => {
    // setThumbnail("");
    // let file = document.querySelector("#thumbnail");
    // file.value = "";
    setPodcastData((prev) => ({ ...prev, uploadThumbload: "" }));
  };

  //for cross button for add podcast
  const HandleCrossClick2 = () => {
    // setPodcastImage("");
    // let file = document.querySelector("#addPodcast");
    // file.value = "";
    setPodcastData((prev) => ({ ...prev, addPodcast: "" }));
  };

  //for fetch all podcastdata
  const fetchAllPodcastData = () => {
    setLoading(true);
    HomeService.ViewAllPodcastSeries()
      .then((res) => {
        if (res && res?.status) {
          setLoading(false);
          let arr = res?.data?.map((item, index) => {
            return {
              sl: index + 1,
              titleOfseries: item?.titleOfseries,
              seriesDescription: item?.seriesDescription,
              podcastName: item?.podcastName,
              artistName: item?.artistName,
              podcastDuration: item?.podcastDuration,
              contentType: item?.contentType,
              audioName: item?.audioName,
              listenFree: item?.listenFree,
              podcastType: item?.podcastType,
              addedBy: item?.addedBy,
              releaseYear: item?.releaseYear,
              uploadThumbload: (
                <>
                  {item?.uploadThumbload ? (
                    <img
                      style={{
                        height: "65%",
                        width: "65%",
                        borderRadius: "9px",
                        margin: "5px",
                      }}
                      src={item?.uploadThumbload}
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
              addPodcast: (
                <>
                  {item?.addPodcast ? (
                    <img
                      style={{
                        height: "65%",
                        width: "65%",
                        borderRadius: "9px",
                        margin: "5px",
                      }}
                      src={item?.addPodcast}
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
          setAllPodcastData(arr);
        }
        // console.log("RESPONSE", res);
      })
      .catch((err) => {
        setLoading(false);
        // console.log("err", err);
      });
  };

  //fetch all category data
  const fetchAllCategoryData = async () => {
    const res = await HomeService.ViewAllPodCastCategory();
    // console.log("fvfvc", res);
    if (res && res.status) {
      // setCatLoader(false)
      setCatData(res?.data);
    } else {
      toast.error(res?.message || "error");
    }
  };

  //fetch all genre data
  const fetchAllGenreData = async () => {
    const res = await HomeService.ViewAllPodCastGenre();
    // console.log("fvfvc", res);
    if (res && res.status) {
      setGenreData(res?.data);
    } else {
      toast.error(res?.message || "error");
    }
  };

  //fetch all mood data
  const fetchAllMoodData = async () => {
    const res = await HomeService.ViewAllMood();
    // console.log("fvfvc", res);
    if (res && res.status) {
      setMoodData(res?.data);
    } else {
      toast.error(res?.message || "error");
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setPodcastData((prev) => ({ ...prev, [name]: value }));
  };


  //handle add more podcast data
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedPodcast = [...podcastData.podcast];
    updatedPodcast[index][name] = value;
    setPodcastData({ ...podcastData, podcast: updatedPodcast });
  };

//add more button
  const addPodcastField = () => {
    setPodcastData({
      ...podcastData,
      podcast: [...podcastData.podcast, { episodeName: "", audioName: "", artistName: "", releaseYear: "", podcastDuration: "", addPodcast: "", uploadThumbload: "" }],
    });
  };

  //remove add more button
  const removePodcastField = index => {
    const updatedPodcast = [...podcastData.podcast];
    updatedPodcast.splice(index, 1);
    setPodcastData({ ...podcastData, podcast: updatedPodcast });
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
          PodcastName
        </div>
      ),
      selector: (row) => row.podcastName,
      width: "15rem",
    },
    {
      name: (
        <div
          style={{ fontSize: "14px", color: "#495057", fontWeight: "bolder" }}
        >
          PodCastDuration
        </div>
      ),
      selector: (row) => row.podcastDuration,
    },
    {
      name: (
        <div
          style={{ fontSize: "14px", color: "#495057", fontWeight: "bolder" }}
        >
          ReleaseYear
        </div>
      ),
      selector: (row) => row.releaseYear,
    },
    {
      name: (
        <div
          style={{ fontSize: "14px", color: "#495057", fontWeight: "bolder" }}
        >
          title Of series
        </div>
      ),
      selector: (row) => row.titleOfseries,
    },
    {
      name: (
        <div
          style={{ fontSize: "14px", color: "#495057", fontWeight: "bolder" }}
        >
          AudioName
        </div>
      ),
      selector: (row) => row.audioName,
    },
    {
      name: (
        <div
          style={{ fontSize: "14px", color: "#495057", fontWeight: "bolder" }}
        >
          ArtistName
        </div>
      ),
      selector: (row) => row.artistName,
    },
    {
      name: (
        <div
          style={{ fontSize: "14px", color: "#495057", fontWeight: "bolder" }}
        >
          seriesDescription
        </div>
      ),
      selector: (row) => row?.seriesDescription,
    },

    {
      name: (
        <div
          style={{ fontSize: "14px", color: "#495057", fontWeight: "bolder" }}
        >
          PodcastType
        </div>
      ),
      selector: (row) => row.podcastType,
    },
    {
      name: (
        <div
          style={{ fontSize: "14px", color: "#495057", fontWeight: "bolder" }}
        >
          ContentType
        </div>
      ),
      selector: (row) => row.contentType,
    },
    // {
    //     name: (
    //         <div
    //             style={{ fontSize: "14px", color: "#495057", fontWeight: "bolder" }}
    //         >
    //             ListenFree
    //         </div>
    //     ),
    //     selector: (row) => row.listenFree,
    // },

    {
      name: (
        <div
          style={{ fontSize: "14px", color: "#495057", fontWeight: "bolder" }}
        >
          UploadThumbnail
        </div>
      ),
      selector: (row) => row.uploadThumbload,
    },
    {
      name: (
        <div
          style={{ fontSize: "14px", color: "#495057", fontWeight: "bolder" }}
        >
          AddPodcast
        </div>
      ),
      selector: (row) => row.addPodcast,
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

  return (
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
              Add Podcast Series
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
              Edit PodCast Series
            </div>
          )}

          <div className="row">
            <div className="col">
              <label htmlFor="formGroupExampleInput">Select ContentType</label>
              <select
                class="form-control"
                aria-label="Default select example"
                name="contentType"
                value={podcastData.contentType}
                onChange={handleChange}
              >
                <option value={""}>Select contentType</option>
                <option value={"podcast"}>Podcast</option>
                <option value={"music"}>Music</option>
              </select>
            </div>


            {/* <div className="row"> */}
            <div className="col">
              <label htmlFor="formGroupExampleInput">Select PodcastType</label>
              <select
                class="form-control"
                aria-label="Default select example"
                name="podcastType"
                value={podcastData.podcastType}
                onChange={handleChange}
              >
                <option value={""}>Select PodcastType</option>
                <option value={"single"}>single</option>
                <option value={"series"}>series</option>
              </select>
            </div>
            {/* </div> */}
          </div>

          <div className="row">
            {/* <div className="col">
                            <label htmlFor="formGroupExampleInput">Select Category</label>
                            <select
                                class="form-control"
                                aria-label="Default select example"
                                name="podcastCategoryID"
                                value={podcastData.podcastCategoryID}
                                onChange={handleChange}
                            >
                                <option value={""} disabled>
                                    Select Category
                                </option>
                                {catData.map((item, i) => (
                                    <option key={i} value={item?._id}>
                                        {item?.catName}
                                    </option>
                                ))}
                            </select>
                        </div> */}

            {/* <div className="col">
                            <label htmlFor="formGroupExampleInput">Select Genre</label>
                            <select
                                class="form-control"
                                aria-label="Default select example"
                                name="podcastGenreID"
                                value={podcastData.podcastGenreID}
                                onChange={handleChange}
                            >
                                <option value={""} disabled>
                                    Select Genre
                                </option>
                                {genreData.map((item, i) => (
                                    <option key={i} value={item?._id}>
                                        {item?.genreName}
                                    </option>
                                ))}
                            </select>
                        </div> */}
          </div>

          <div className="row">
            <div className="col">
              <label htmlFor="formGroupExampleInput">title Of Series</label>
              <input
                type="text"
                className="form-control"
                placeholder="titleOfseries"
                name="titleOfseries"
                value={podcastData.titleOfseries}
                onChange={handleChange}
              />
            </div>

            <div className="col">
              <label htmlFor="formGroupExampleInput">Series Description</label>
              <input
                type="text"
                className="form-control"
                placeholder="seriesDescription"
                name="seriesDescription"
                value={podcastData.seriesDescription}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="row">
            <div className="col">
              <label htmlFor="formGroupExampleInput">Select Mood</label>
              <select
                class="form-control"
                aria-label="Default select example"
                name="moodID"
                value={podcastData.moodID}
                onChange={handleChange}
              >
                <option value={""} disabled>
                  Select Mood
                </option>
                {moodData.map((item, i) => (
                  <option key={i} value={item?._id}>
                    {item?.mood}
                  </option>
                ))}
              </select>
            </div>
          </div>


          {
            podcastData?.podcast?.map((item, index) => {
              return (
                <>
                  <div className="row">
                    <div className="col">
                      <label htmlFor="formGroupExampleInput">Podcast Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Podcast Name"
                        name="podcastName"
                        value={item?.podcastName}
                        onChange={e => handleInputChange(e, index)}
                      />
                    </div>

                    <div className="col">
                      <label htmlFor="formGroupExampleInput">Audio Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Audio Name"
                        name="audioName"
                        value={item?.audioName}
                        onChange={e => handleInputChange(e, index)}
                      />
                    </div>

                    <div className="row">
                      <div className="col">
                        <label htmlFor="formGroupExampleInput">Artist Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Artist Name"
                          name="artistName"
                          value={item?.artistName}
                          onChange={e => handleInputChange(e, index)}
                        />
                      </div>


                      <div class="col">
                        <label for="inputEmail4">
                          Release Year<span style={{ color: "red" }}></span> :
                        </label>
                        <input
                          type="date"
                          class="form-control"
                          name="releaseYear"
                          value={item?.releaseYear}
                          onChange={e => handleInputChange(e, index)}
                          placeholder="Enter release year"
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div class="col">
                        <label for="inputEmail4">
                          Podcast Duration<span style={{ color: "red" }}></span> :
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          name="podcastDuration"
                          value={item?.podcastDuration}
                          onChange={e => handleInputChange(e, index)}
                          placeholder="Enter podcast duration"
                        />
                      </div>

                      <div class="col">
                        <label for="inputEmail4">
                          Episode Name<span style={{ color: "red" }}></span> :
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          name="episodeName"
                          value={item?.episodeName}
                          onChange={e => handleInputChange(e, index)}
                          placeholder="Enter episode name"
                        />
                      </div>
                    </div>


                    <label for="exampleInputEmail1">
                      Thumbnail<span style={{ color: "red" }}></span> :
                    </label>

                    <input
                      class="form-control"
                      onChange={(e) => HandleImage(e)}
                      type="file"
                      id="thumbnail"
                      accept="image/*"
                    />
                    {imageLoader ? (
                      <>
                        <ImageLoader />{" "}
                      </>
                    ) : null}
                    {item?.uploadThumbload && (
                      <>
                        <div>
                          <img
                            style={{
                              height: "10%",
                              width: "10%",
                              marginTop: "12px",
                              borderRadius: "5px",
                            }}
                            src={item?.uploadThumbload}
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

                    <label for="exampleInputEmail1">
                      AddPodcast<span style={{ color: "red" }}></span> :
                    </label>
                    <input
                      class="form-control"
                      onChange={(e) => HandlePodcastImage(e)}
                      type="file"
                      id="addPodcast"
                      accept="image/*"
                    />
                    {imageLoader2 ? (
                      <>
                        <ImageLoader />{" "}
                      </>
                    ) : null}
                    {item?.addPodcast && (
                      <>
                        <div>
                          <img
                            style={{
                              height: "10%",
                              width: "10%",
                              marginTop: "12px",
                              borderRadius: "5px",
                            }}
                            src={item?.addPodcast}
                          />
                          <button
                            onClick={() => HandleCrossClick2()}
                            style={{ color: "red" }}
                            type="button"
                            class="btn-close"
                            aria-label="Close"
                          ></button>
                        </div>
                      </>
                    )}


                    {podcastData.podcast.length > 1 && (
                      <button
                        // type="button"
                        className="button"
                        onClick={() => removePodcastField(index)}
                      // style={{ background: 'blue' }}
                      >
                        -
                      </button>
                    )}
                  </div>

                </>

              )
            })
          }
          <button type="button" className="submit" onClick={addPodcastField} style={{ background: 'blue' }}>
            Add Podcast
          </button>



          {/* <label for="exampleInputEmail1">
            Thumbnail<span style={{ color: "red" }}></span> :
          </label>

          <input
            class="form-control"
            onChange={(e) => HandleImage(e)}
            type="file"
            id="thumbnail"
            accept="image/*"
          />
          {imageLoader ? (
            <>
              <ImageLoader />{" "}
            </>
          ) : null}
          {podcastData?.podcast?.uploadThumbnail && (
            <>
              <div>
                <img
                  style={{
                    height: "10%",
                    width: "10%",
                    marginTop: "12px",
                    borderRadius: "5px",
                  }}
                  src={podcastData?.podcast?.uploadThumbnail}
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

          <label for="exampleInputEmail1">
            AddPodcast<span style={{ color: "red" }}></span> :
          </label>
          <input
            class="form-control"
            onChange={(e) => HandlePodcastImage(e)}
            type="file"
            id="addPodcast"
            accept="image/*"
          />
          {imageLoader2 ? (
            <>
              <ImageLoader />{" "}
            </>
          ) : null}
          {podcastData?.podcast?.addPodcast && (
            <>
              <div>
                <img
                  style={{
                    height: "10%",
                    width: "10%",
                    marginTop: "12px",
                    borderRadius: "5px",
                  }}
                  src={podcastData?.AddPodcast}
                />
                <button
                  onClick={() => HandleCrossClick2()}
                  style={{ color: "red" }}
                  type="button"
                  class="btn-close"
                  aria-label="Close"
                ></button>
              </div>
            </>
          )} */}

          {hide ? (
            <button
              class="btn btn-primary"
              style={{ marginTop: "1rem" }}
              onClick={AddPodcast}
            >
              Submit
            </button>
          ) : (
            <button
              class="btn btn-primary"
              style={{ marginTop: "1rem" }}
              onClick={UpdatePodcast}
            >
              Update
            </button>
          )}

          <div
            style={{
              textAlign: "center",
              fontSize: "20px",
              color: "#868e96",
              margin: "35px",
            }}
            className="card-title"
          >
            Manage Podcast
          </div>
          <DataTable columns={columns} data={AllPodcastData} pagination />
        </div>
      </div>
    </div>
  );
};

export default AddAndManagePodcastSeries;

