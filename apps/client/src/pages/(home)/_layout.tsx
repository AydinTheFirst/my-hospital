import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <>
      <main className="container px-3 py-16 md:px-10">
        <div className="grid gap-5">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default HomeLayout;
