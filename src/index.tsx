import { Box, Button, Typography, Container } from "@mui/material";
import { useState } from "react";
import { useApi } from "src/context/ApiContext";
import { CoordinatesServerResponse } from "src/api/dto/navi.dto";
import { FileUploader, FileChangeFunction } from "@microfrontends-diploma/shared-code";
import "@microfrontends-diploma/shared-code/dist/esm/index.css";

// TODO: прикрутить валидацию
// TODO: навести красоту
const Navi = () => {
  const [filesContent, setFilesContent] = useState<{
    obsfile: { content: Blob; name: string } | null;
    navfile: { content: Blob; name: string } | null;
  }>({ obsfile: null, navfile: null });
  const [stationCoordinates, setStationCoordinates] = useState<CoordinatesServerResponse | null>(null);
  const api = useApi();

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

    formData.append("obsfile", filesContent.obsfile.content); // 17o
    formData.append("navfile", filesContent.navfile.content); // 17n

    api.naviService.getCoordinates(formData).then((res: CoordinatesServerResponse) => setStationCoordinates(res));
  };

  return (
    <Container>
      <Typography variant='h3'>Navi</Typography>
      <Box>
        <Typography>Загрузите OBS файл</Typography>
        <FileUploader id='obsfile' onChange={onFileChanged("obs")} />

        <Typography>Загрузите Nav файл</Typography>
        <FileUploader id='navfile' onChange={onFileChanged("nav")} />

        <Button disabled={!filesContent.obsfile || !filesContent.navfile} onClick={onCalculateCoordinates}>
          Рассчитать координаты
        </Button>

        {stationCoordinates ? (
          stationCoordinates.valid ? (
            <Box>
              <Typography>Координаты станции:</Typography>
              <Typography>x: {stationCoordinates.coordinates[0]}</Typography>
              <Typography>y: {stationCoordinates.coordinates[1]}</Typography>
              <Typography>z: {stationCoordinates.coordinates[2]}</Typography>
            </Box>
          ) : (
            <Typography>Координаты станции некорректны!</Typography>
          )
        ) : null}
      </Box>
    </Container>
  );
}

export default Navi;
