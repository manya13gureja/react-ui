import { notFound } from 'next/navigation'
import projects from '@/data/interactions.json'
import ClientPage from './clientpage'


export default function Page({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug)

  if (!project) return notFound()

  return <ClientPage project={project} />
}
