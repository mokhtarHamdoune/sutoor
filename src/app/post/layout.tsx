function PostLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-4/12 m-auto mt-12 border border-gray-300 p-4">
      {children}
    </div>
  );
}

export default PostLayout;
