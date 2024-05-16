import  { Router } from 'express';
import  { getDocuments, postDocument, downloadFile, deleteFile, onSendFile } from '../controllers/documents';
import  { userAuthentication } from '../middlewares/authentication'
const router = Router();

router.get('/documents', userAuthentication, getDocuments);
router.post('/upload', userAuthentication, postDocument)
router.get('/download/:id', userAuthentication, downloadFile);
router.post('/send', userAuthentication, onSendFile)
router.delete('/delete/:id', userAuthentication, deleteFile);

export = router;