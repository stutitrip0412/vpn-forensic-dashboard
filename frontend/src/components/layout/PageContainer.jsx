const PageContainer = ({ children }) => {
  return (
    <main
      className="
        p-4
        sm:p-6
        lg:p-8
        max-w-[1800px]
        mx-auto
      "
    >
      {children}
    </main>
  );
};

export default PageContainer;