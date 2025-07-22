import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"

export default function HomePage() {
  redirect("/feed")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Welcome to Dojo</h1>
          <p className="text-xl text-slate-600 mb-8">
            Transform your long-form videos into interactive, chapterized timelines using AI
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/upload">
              <Button size="lg" className="px-8">
                Upload Video
              </Button>
            </Link>
            <Link href="/browse">
              <Button size="lg" variant="outline" className="px-8 bg-transparent">
                Browse Videos
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🎥</span>
                <span>Upload</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Upload your video and let our AI automatically detect and create chapters
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>✏️</span>
                <span>Edit</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Review and refine the generated chapters with our intuitive editing interface
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🚀</span>
                <span>Publish</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Share your chapterized content with viewers for an enhanced experience</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Quick Navigation</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/upload">
              <Button variant="outline">Upload Video</Button>
            </Link>
            <Link href="/browse">
              <Button variant="outline">Browse Videos</Button>
            </Link>
            <Link href="/processing">
              <Button variant="outline">Processing Demo</Button>
            </Link>
            <Link href="/review">
              <Button variant="outline">Chapter Review</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
