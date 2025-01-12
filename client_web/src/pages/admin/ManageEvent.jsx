import React, { useEffect, useState } from "react";
import { apiGetEvents, apiUpdateStatus } from "../../apis/event";
import moment from "moment/moment";
import "moment/locale/vi";
import { Pagination } from "../../components";
import { useSearchParams } from "react-router-dom";
import { status } from "../../utils/contants";
import Swal from "sweetalert2";

moment.locale("vi");

function ManageEvent() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [params] = useSearchParams();
  const [statusEvent, setStatusEvent] = useState(false);
  const fetchData = async (queries) => {
    const response = await apiGetEvents({
      limit: 10,
      page: queries.page,
      order: ["createdAt", "DESC"],
    });
    if (response.success) {
      setData(response.response);
      setCount(response.count);
      setStatusEvent(false);
    }
  };

  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    fetchData({ ...queries });
  }, [params, statusEvent]);
  //console.log(data);
  const handleUpdateStatus = async (eid, status) => {
    if (status === 1) {
      Swal.fire({
        title: "Thông báo",
        text: "Bạn có xác nhận duyệt sự kiện",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Hủy",
        confirmButtonText: "Xác nhận",
      }).then(async (rs) => {
        if (rs.isConfirmed) {
          const reponse = await apiUpdateStatus(eid, { status: 2 });
          //console.log(reponse);
          setStatusEvent(true);
        }
      });
    } else if (status === 5) {
      Swal.fire({
        title: "Thông báo",
        text: "Bạn có muốn duyệt sự kiện lại không",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Hủy",
        confirmButtonText: "Xác nhận",
      }).then(async (rs) => {
        if (rs.isConfirmed) {
          const reponse = await apiUpdateStatus(eid, { status: 2 });
          //console.log(reponse);
        }
      });
    } else {
      Swal.fire({
        title: "Thông báo",
        text: "Sự kiện bạn đã được duyệt rồi",
        icon: "info",
        confirmButtonText: "Xác nhận",
      });
    }
  };
  const handleCancelStatus = async (eid, status) => {
    if (status === 5) {
      Swal.fire({
        title: "Thông báo",
        text: "Sự kiện đã bị hủy",
        icon: "error",
        confirmButtonText: "Xác nhận",
      });
    } else {
      Swal.fire({
        title: "Thông báo",
        text: "Bạn có muốn hủy sự kiện",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Hủy",
        confirmButtonText: "Xác nhận",
      }).then(async (rs) => {
        if (rs.isConfirmed) {
          const reponse = await apiUpdateStatus(eid, { status: 5 });
          //console.log(reponse);
        }
      });
    }
  };
  return (
    <div className="w-full h-full py-2 px-[20px]">
      <h1 className="text-[24px] font-[700] mb-2">Quản lý sự kiện</h1>
      <div className="rounded-[8px] bg-[#fff] ">
        <table className="">
          <thead className=" text-[#4E73DF]   border-b border-[#4E73DF]">
            <tr className=" ">
              <td className="w-[5%] text-center font-bold py-2">#</td>
              <td className="w-[15%] text-center font-bold">Ảnh</td>
              <td className="w-[30%] text-center font-bold">Tên sự kiện</td>
              <td className="w-[10%] text-center font-bold">Loại</td>
              <td className="w-[10%] text-center font-bold">Trạng thái</td>
              <td className="w-[10%] text-center font-bold">Ngày tạo</td>
              <td className="w-[20%] text-center font-bold">Duyệt sự kiện</td>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 &&
              data.map((el, index) => (
                <tr
                  key={el.id}
                  className="hover:bg-[#4E73DF] hover:text-white hover:opacity-[0.85] duration-95 ease-in-out cursor-pointer"
                >
                  <td className="w-[5%] text-center">
                    {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                      +import.meta.env.VITE_REACT_APP_LIMIT +
                      index +
                      1}
                  </td>
                  <td className="w-[15%] text-center py-1">
                    <div className="w-full h-[45px] flex justify-center">
                      <img
                        src={el.image}
                        alt="ảnh"
                        className="w-[100px] h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="w-[30%]">
                    <p className="line-clamp-2">{el.title}</p>
                  </td>
                  <td className="w-[10%] text-center">
                    {!el.typeEvent ? "Offline" : "Online"}
                  </td>
                  <td className="text-center w-[10%]">
                    {status.find((e) => e.id === el.status)?.text}
                  </td>
                  <td className="w-[10%] text-center">
                    {moment(el.createdAt).fromNow()}
                  </td>
                  <td className="w-[20%] text-center">
                    <div className="flex items-center justify-center gap-1 text-white">
                      <div
                        onClick={() => handleUpdateStatus(el.id, el.status)}
                        className="px-2 w-[58px] bg-green-400 rounded-md cursor-pointer"
                      >
                        Duyệt
                      </div>
                      <div
                        onClick={() => handleCancelStatus(el.id, el.status)}
                        className="px-2 w-[58px] bg-red-500 rounded-md cursor-pointer"
                      >
                        Huỷ
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="w-full mt-1">
        <Pagination totalCount={count} />
      </div>
    </div>
  );
}

export default ManageEvent;
