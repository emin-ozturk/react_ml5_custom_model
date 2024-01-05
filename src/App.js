import './App.css';
import { useState } from "react";
import Input from './Input';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function App() {
  const [model, setModel] = useState(null);
  const [result, setResult] = useState(null);
  const [label, setLabel] = useState([]);
  const [image, setImage] = useState([]);
  const [info, setInfo] = useState(null);
  const [loss, setLoss] = useState([]);

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
        let i = 1;
        customModel.train((lossValue) => {
          if (lossValue) {
            setLoss(prevLoss => [...prevLoss, { iteration: i, lossValue: lossValue }]);
            console.log('Eğitim kaybı: ', lossValue, i++);
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
      const imgTest = document.getElementById('imgTest');
      const selectedFile = image.files[0];

      if (selectedFile) {
        imgTest.src = URL.createObjectURL(selectedFile);

        imgTest.onload = function () {
          model.classify(imgTest, (err, results) => {
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
  }

  const loadImage = (newImage) => {
    setImage([...image, ...newImage]);
  }

  return (
    <div className='flex flex-col items-center justify-center w-full h-full mt-12'>
      <div className='flex flex-row items-center justify-center flex-wrap'>
        <Input name="0" setLabel={handleLabel} label={label[0]} image={loadImage} />
        <Input name="1" setLabel={handleLabel} label={label[1]} image={loadImage} />
      </div>

      <div className='w-full flex flex-row items-center justify-center px-10 my-16'>

        <div className='bg-white drop-shadow-2xl mr-10 w-2/3 rounded-lg h-[420px] p-5'>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={loss} >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="iteration" tick={{ fontSize: 14 }} />
              <YAxis tick={{ fontSize: 14 }} domain={[-1, 1]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="lossValue" stroke="#82ca9d" dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <button
            className='w-full bg-blue-600 text-white font-medium text-sm p-2 rounded'
            onClick={trainModel}>
            Modeli Eğit
          </button>
          {info ?
            <div className='text-blue-500 px-10 py-2 rounded flex justify-center items-center'>
              {info}
            </div>
            : ""
          }
        </div>

        <div className='h-[420px] bg-white drop-shadow-2xl rounded-lg p-5'>
          <h2 className='text-black font-medium'>Test</h2>
          <input id="testImage" type="file" onChange={handleClassifyImage} className="input" />

          <img id='imgTest' alt="" className='min-w-64 min-h-64 max-w-64 max-h-64' />
          {result && (
            <div>
              <p className='font-medium text-sm mt-3'>{result[0].label}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
