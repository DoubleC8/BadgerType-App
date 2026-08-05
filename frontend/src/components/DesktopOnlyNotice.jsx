import { IoDesktopOutline } from "react-icons/io5";

const DesktopOnlyNotice = () => {
  return (
    <section
      className="lg:hidden
      h-screen"
    >
      <div className="h-1/2 flex flex-col gap-3 text-center justify-between">
        <h1 className="text-5xl">
          Welcome to <span className="text-(--accent)">BADGERTYPE!</span>
        </h1>
        <div className="flex flex-col gap-6 items-center">
          <IoDesktopOutline className="text-5xl text-(--accent)" />
          <p className="text-2xl text-(--text-secondary) font-(family-name:--geist)">
            BadgerType is currently only available on desktop browsers. Switch
            over to a desktop to play!
          </p>
        </div>
      </div>
    </section>
  );
};

export default DesktopOnlyNotice;
