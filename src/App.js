import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react";

function App() {
  const [dogImages, setDogImages] = useState([]);
  const [catImages, setCatImages] = useState([]);
  const [model, setModel] = useState(null);
  const [result, setResult] = useState(null);


  const trainModel = () => {
    // Köpek ve kedi resimlerini içeren veri setini oluşturun
    const data = {
      labels: ['köpek', 'kedi'],
      data: [dogImages, catImages],
    };

    // Transfer Learning için Mobilenet modelini yükleyin
    const featureExtractor = window.ml5.featureExtractor('MobileNet', () => {
      console.log('Feature extractor yüklendi.');
      const customModel = featureExtractor.classification();

      let counter = 0;

      data.data[0].forEach((img) => {
        const imageElement = new Image();
        imageElement.src = URL.createObjectURL(img);

        // Resim yüklendikten sonra callback
        imageElement.onload = () => {
          customModel.addImage(imageElement, 'köpek', () => {
            counter++;
            console.log('Köpek resmi eklendi.');

            if (counter === data.data[0].length + data.data[1].length) {
              // Tüm resimler eklendiyse modeli eğitin
              trainCustomModel(customModel);
            }
          });
        };
      });

      // Cat images
      data.data[1].forEach((img) => {
        const imageElement = new Image();
        imageElement.src = URL.createObjectURL(img);

        // Resim yüklendikten sonra callback
        imageElement.onload = () => {
          customModel.addImage(imageElement, 'kedi', () => {
            counter++;
            console.log('Kedi resmi eklendi.');

            if (counter === data.data[0].length + data.data[1].length) {
              // Tüm resimler eklendiyse modeli eğitin
              trainCustomModel(customModel);
            }
          });
        };
      });

      // Veri setini kullanarak modeli eğitin
      const trainCustomModel = (customModel) => {
        customModel.train((lossValue) => {
          if (lossValue) {
            console.log('Eğitim kaybı: ', lossValue);
          } else {
            console.log('Eğitim tamamlandı.');
            setModel(customModel);
          }
        });
      };
    });
  };

  const handleDogImageChange = (e) => {
    const files = e.target.files;
    const validImageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
    setDogImages(validImageFiles);
  };

  const handleCatImageChange = (e) => {
    const files = e.target.files;
    const validImageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
    setCatImages(validImageFiles);
  };

  const classifyImage = () => {
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

              console.log(result)
            }
          });
        }
      } else {
        console.error('Lütfen bir resim seçin.');
      }
    }
  };

  return (
    <div>
      <h2>Köpek Resimleri</h2>
      <input type="file" multiple onChange={handleDogImageChange} />

      <h2>Kedi Resimleri</h2>
      <input type="file" multiple onChange={handleCatImageChange} />

      <button onClick={trainModel}>Modeli Eğit</button>

      <h2>Test İçin Resim Seç</h2>
      <input id="testImage" type="file" />
      <button onClick={classifyImage}>Resmi Sınıflandır</button>

      {result && (
        <div>
          <h2>Sınıflandırma Sonuçları:</h2>
          <p>{result[0].label}</p>
        </div>
      )}
    </div>
  );
}

export default App;
