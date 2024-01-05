import './App.css';
import { useState } from "react";
import Input from './Input';

function App() {
  const [model, setModel] = useState(null);
  const [result, setResult] = useState(null);
  const [label, setLabel] = useState([]);
  const [image, setImage] = useState([]);
  const [info, setInfo] = useState(null);

  const trainModel = () => {
    setInfo("Model Hazırlanıyor...");
    const featureExtractor = window.ml5.featureExtractor('MobileNet', () => {
      console.log('Feature extractor yüklendi.');
      const customModel = featureExtractor.classification();

      let counter = 0;

      image.forEach(item => {
        setInfo("Resimler Yükleniyor...");
        const imageElement = new Image();
        imageElement.src = URL.createObjectURL(item.image);

        imageElement.onload = () => {
          customModel.addImage(imageElement, item.label, () => {
            counter++;
            console.log(item.label + ' resmi eklendi.');

            if (counter === image.length) {
              trainCustomModel(customModel);
            }
          });
        };
      })

      const trainCustomModel = (customModel) => {
        setInfo("Model Eğitiliyor...");
        customModel.train((lossValue) => {
          if (lossValue) {
            console.log('Eğitim kaybı: ', lossValue);
          } else {
            console.log('Eğitim tamamlandı.');
            setInfo("Eğitim Tamamlandı");
            setInterval(() => {
              setInfo(null);
            }, 2000);

            setModel(customModel);
          }
        });
      };
    });
  };

  const handleClassifyImage = (e) => {
    if (model) {
      const image = document.getElementById('testImage');
      const selectedFile = image.files[0];

      if (selectedFile) {
        const imageElement = new Image();
        imageElement.src = URL.createObjectURL(selectedFile);

        imageElement.onload = function () {
          model.classify(imageElement, (err, results) => {
            if (err) {
              console.error(err);
            } else {
              setResult(results);
            }
          });
        }
      } else {
        console.error('Lütfen bir resim seçin.');
      }
    }
  };

  const handleLabel = (e) => {
    setLabel({ ...label, [e.target.name]: e.target.value });
    console.log(label)
  }

  const x = (x) => {
    setImage([...image, ...x]);
  }

  return (
    <div className='p-24 flex flex-row items-center h-full'>
      <div className='flex flex-col mr-10'>
        <Input name="0" setLabel={handleLabel} label={label[0]} image={x} />
        <Input name="1" setLabel={handleLabel} label={label[1]} image={x} />
      </div>

      <div className='bg-white drop-shadow-2xl mr-10 min-w-64 h-96 p-5'>
        <button
          className='w-full bg-blue-600 text-white font-medium text-sm p-2 rounded'
          onClick={trainModel}>
          Modeli Eğit
        </button>

      </div>

      <div className='bg-white drop-shadow-2xl min-w-64 mr-10 p-5'>
        <h2 className='text-black font-medium'>Test</h2>
        <input id="testImage" type="file" onChange={handleClassifyImage}
          className="block w-full text-sm text-gray-500
                  file:me-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-600 file:text-white
                  hover:file:bg-blue-700 "/>

        {result && (
          <div>
            <h2>Sınıflandırma Sonuçları:</h2>
            <p>{result[0].label}</p>
          </div>
        )}
      </div>

      {info ?
        <div className='absolute absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        bottom-10 bg-blue-500 text-white px-10 py-2 rounded flex justify-center items-center'>
          {info}
        </div>
        : ""
      }

    </div>
  );
}

export default App;
