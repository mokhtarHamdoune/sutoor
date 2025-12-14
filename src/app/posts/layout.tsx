function PostLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:w-10/12 lg:w-8/12 xl:w-6/12 max-w-6xl m-auto mt-12 border border-gray-300">
      {children}
    </div>
  );
}

export default PostLayout;
