const loadmodels = Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri("/public"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/public"),
  faceapi.nets.ssdMobilenetv1.loadFromUri("/public"),
]);

const start = async () => {
  const refimg = await loadimg();
  console.log(refimg);

  document.getElementById("uploadimg").addEventListener("change", async () => {
    console.log("image changed");
    const image = await faceapi.bufferToImage(
      document.getElementById("uploadimg").files[0]
    );
    const imgd = await faceapi
      .detectSingleFace(image)
      .withFaceLandmarks()
      .withFaceDescriptor();
    const faceMatchers = refimg.map((img) => new faceapi.FaceMatcher(img, 0.6));
    const bestmatches = faceMatchers.map((facematcher) =>
      facematcher.findBestMatch(imgd.descriptor)
    );
    console.log(bestmatches.toString());
    // const bestmatch = faceMatcher.findBestMatch(imgd.descriptor);
    // console.log(bestmatch);
  });
};
const loadimg = async () => {
  const labels = ["bill_gates"];
  console.log("loading images");
  const arr = await Promise.all(
    labels.map(async (label) => {
      const descriptors = [];
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(
          `./public/images/${label}_${i}.jpg`
        );
        const imgd = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        descriptors.push(
          new faceapi.LabeledFaceDescriptors(label, [imgd.descriptor])
        );
      }
      return descriptors;
    })
  );
  //   console.log(arr);
  return arr;
};
loadmodels
  .then((res) => {
    console.log("models loaded");
    start();
  })
  .catch((err) => console.log(err));
