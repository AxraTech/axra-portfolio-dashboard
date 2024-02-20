const WeeklyCalendar = (props) => {
  console.log("date time ", props.date_time);
  return (
    <>
      <div className="bg-white p-5 rounded-lg shadow-lg w-1/2 ">
        <h1>Weekly Appointment </h1>
        <div className="flex my-3  gap-5 font-bold  text-text_color ">
          <button className=" w-full py-2 border border-1 rounded border-text_color">
            <p className="flex justify-center ">01</p>
            <p className="flex justify-center">MON</p>
          </button>
          <button className=" w-full py-2 border border-1 rounded border-text_color">
            <p className="flex justify-center ">01</p>
            <p className="flex justify-center">MON</p>
          </button>
          <button className=" w-full py-3 text-sidebar_hover_color border border-1 rounded border-text_color">
            <p className="flex justify-center ">01</p>
            <p className="flex justify-center">MON</p>
          </button>
          <button className=" w-full py-3 text-sidebar_hover_color border border-1 rounded border-text_color">
            <p className="flex justify-center ">01</p>
            <p className="flex justify-center">MON</p>
          </button>
          <button className=" w-full py-3 text-sidebar_hover_color border border-1 rounded border-text_color">
            <p className="flex justify-center ">01</p>
            <p className="flex justify-center">MON</p>
          </button>
        </div>
        <div className="border-s-4  rounded-md px-2 py-1.5 bg-client1Bgcolor border-text_color">
          <div className="flex justify-between">
            <p className="text-text_color font-bold">
              Appointment With PowerPlay Client
            </p>
            <p>10:30 AM</p>
          </div>
          <p>At Office</p>
        </div>
        <div className="border-s-4 my-3 rounded-md px-2 py-1.5 bg-client2BgColor border-text_color">
          <div className="flex justify-between">
            <p className="text-client2Color font-bold">
              Appointment with V.jun client
            </p>
            <p>10:30 AM</p>
          </div>
          <p>At Office</p>
        </div>
        <div className="border-s-4 my-3 rounded-md px-2 py-1.5 bg-client3BgColor border-text_color">
          <div className="flex justify-between">
            <p className="text-client3Color font-bold">
              Appointment With PowerPlay Client
            </p>
            <p>10:30 AM</p>
          </div>
          <p>At Office</p>
        </div>
      </div>
    </>
  );
};

export default WeeklyCalendar;
