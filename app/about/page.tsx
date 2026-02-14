import Header from "@/component/Home/GetStarted/Header";

const page = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="h-16"/>
      <div className="p-6">
        <h1 className="text-2xl font-bold">About Page</h1>
        <p className="mt-4">This is the about page content.</p>
      </div>
    </div>
  )
}

export default page