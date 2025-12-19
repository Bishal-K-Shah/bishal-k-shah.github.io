import type { FC, PropsWithChildren } from 'react';

const CodeBlock: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="my-6 rounded-lg bg-gray-900 text-white overflow-hidden shadow-inner dark:bg-gray-800">
      <pre className="p-4 text-sm overflow-x-auto font-code">
        <code>{children}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
