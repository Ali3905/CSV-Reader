import papa from "papaparse"
import ExcelReader from "./components/ExcelReader";

export default function Home() {
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    papa.parse(file, {
      header : true,
      complete : (results) => {
        console.log(results.data);
      }
    })
  }

  return (
    <main
      className={``}
    >
      <ExcelReader />
    </main>
  )
}
