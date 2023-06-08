import { Box, Button, Typography, Container, Grid, LinearProgress } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useApi } from "src/context/ApiContext";
import { CoordinatesServerResponse } from "src/api/dto/navi.dto";
import { FileUploader, FileChangeFunction } from "@microfrontends-diploma/shared-code";
import "@microfrontends-diploma/shared-code/dist/esm/index.css";

// TODO: прикрутить валидацию
// TODO: навести красоту
const Navi = () => {
  const api = useApi();

  const [filesContent, setFilesContent] = useState<{
    obsfile: { content: Blob; name: string } | null;
    navfile: { content: Blob; name: string } | null;
  }>({ obsfile: null, navfile: null });
  const [previousFilesContent, setPreviousFilesContent] = useState<{
    obsfile: { content: Blob; name: string } | null;
    navfile: { content: Blob; name: string } | null;
  }>({ obsfile: null, navfile: null });
  const [stationCoordinates, setStationCoordinates] = useState<CoordinatesServerResponse | null>(null);
  const [calculationInProgress, setCalculationInProgress] = useState<boolean>(false);
  const [calculationBtnDisabled, setCalculationBtnDisabled] = useState<boolean>(false);

  // TODO: закончить сравнение двух буферов
  // useEffect(() => {
  //   if (filesContent.obsfile && previousFilesContent.obsfile && filesContent.navfile && previousFilesContent.navfile) {
  //     const promises = Promise.all([
  //       filesContent.obsfile.content.arrayBuffer(),
  //       previousFilesContent.obsfile.content.arrayBuffer(),
  //       filesContent.navfile.content.arrayBuffer(),
  //       previousFilesContent.navfile.content.arrayBuffer(),
  //     ]);

  //     promises.then((res) => {
  //       const obsFileEqual = !Boolean(new Buffer(res[0]).compare(new Buffer(res[1])));
  //       const navFileEqual = !Boolean(new Buffer(res[2]).compare(new Buffer(res[3])));
  //       console.log('obsFileEqual', obsFileEqual);
  //       console.log('navFileEqual', navFileEqual);

  //       setCalculationBtnDisabled(obsFileEqual && navFileEqual);
  //     });
  //   } else {
  //     setCalculationBtnDisabled(false);
  //   }
  // }, [filesContent, previousFilesContent]);

  const onFileChanged =
    (type: "obs" | "nav"): FileChangeFunction =>
    (fileList) => {
      let name: "obsfile" | "navfile" = type === "obs" ? "obsfile" : "navfile";

      if (fileList.length) {
        const file = fileList[0];

        file.arrayBuffer().then((arrayBuffer) => {
          setFilesContent((prevState) => ({ ...prevState, [name]: { content: new Blob([new Uint8Array(arrayBuffer)]), name: file.name } }));
        });
      } else {
        setFilesContent((prevState) => ({ ...prevState, [name]: null }));
      }
    };

  const onCalculateCoordinates = () => {
    const formData = new FormData();

    formData.append("obsfile", filesContent.obsfile.content, filesContent.obsfile.name); // 17o
    formData.append("navfile", filesContent.navfile.content, filesContent.navfile.name); // 17n

    setCalculationInProgress(true);
    setPreviousFilesContent(filesContent);
    api.naviService
      .getCoordinates(formData)
      .then((res: CoordinatesServerResponse) => setStationCoordinates(res))
      .finally(() => setCalculationInProgress(false));
  };

  return (
    <Container>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant='h3'>Navi</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography>Загрузите OBS файл</Typography>
          <FileUploader id='obsfile' onChange={onFileChanged("obs")} disabled={calculationInProgress} />
        </Grid>

        <Grid item xs={12}>
          <Typography>Загрузите NAV файл</Typography>
          <FileUploader id='navfile' onChange={onFileChanged("nav")} disabled={calculationInProgress} />
        </Grid>

        {calculationInProgress && (
          <Grid item xs='auto'>
            <Typography>Пожалуйста, подождите, происходит расчет положения станции...</Typography>
            <LinearProgress />
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            variant='contained'
            disabled={!filesContent.obsfile || !filesContent.navfile || calculationInProgress || calculationBtnDisabled}
            onClick={onCalculateCoordinates}
          >
            Рассчитать координаты
          </Button>
        </Grid>

        {stationCoordinates && !calculationInProgress ? (
          <Grid item xs={12}>
            {stationCoordinates.valid ? (
              <>
                <Typography variant='h6'>Координаты станции:</Typography>
                <Typography>x: {stationCoordinates.coordinates[0]}</Typography>
                <Typography>y: {stationCoordinates.coordinates[1]}</Typography>
                <Typography>z: {stationCoordinates.coordinates[2]}</Typography>
              </>
            ) : (
              <Typography variant='h6' color='error'>
                Координаты станции некорректны!
              </Typography>
            )}
          </Grid>
        ) : null}
      </Grid>
    </Container>
  );
};

export default Navi;
