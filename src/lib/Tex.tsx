import katex from 'katex'
export default function Tex({ f }: { f: string }) { return <span dangerouslySetInnerHTML={{ __html: katex.renderToString(f, { throwOnError: false }) }} /> }
