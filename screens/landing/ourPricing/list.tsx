const ListMap = (props: any) => {
  // console.log(props.list);

  return (
    <>
      {props.list &&
        props.list.map((listItem: any, listIndex: any) => (
          <div
            key={listIndex}
            className="flex flex-row items-center mt-3 gap-2"
          >
            <img
              src="https://res.cloudinary.com/damm9iwho/image/upload/v1730809748/mynaui_check-hexagon-solid_t7vhzg.svg"
              alt=""
            />
            <p className="">{listItem}</p>
          </div>
        ))}
    </>
  );
};

export default ListMap;
