export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full bg-background">{children}</div>;
}
