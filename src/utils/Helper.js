import * as jose from 'jose';
import config from './config';

export async function generateViewerJWT(license, id) {
    try {
        if (!license || !id) throw new Error('License and session id required');
        const pkcs8 = config.pkcs8;
        const alg = 'RS256';
        const privateKey = await jose.importPKCS8(pkcs8, alg);
        const jwt = await new jose.SignJWT({
            displayName: 'Viewer',
            policy: {
                version: 2,
                sessions: {
                    id: id,
                },
            },
        })
            .setProtectedHeader({ alg })
            .setIssuedAt()
            .setIssuer(license)
            .setSubject('viewer@cobrowse.io')
            .setAudience('https://cobrowse.io')
            .setExpirationTime('10h')
            // .setExpirationTime('1m')
            .sign(privateKey);

        return jwt;
    } catch (error) {
        console.log('Error generating JWT for agent preview (generateViewerJWT()) ==> ', error);
        throw new Error('Error generating JWT for agent preview (generateViewerJWT()) ');
    }
}

export async function resetPresentSession(CobrowseIO) {
    try {
        // await CobrowseIO.stop()
        //     .then((suc) => console.log('suck ses->< ', suc))
        //     .catch((err) => console.log('err--< ', err));

        await CobrowseIO.stop();
    } catch (error) {
        console.log('Error Resetting present session (resetPresentSession()) => ', error);
        throw new Error(error);
    }
}

export async function startPresentSession(
    CobrowseIO,
    cobrowse,
    session,
    setSession,
    shareStartUI,
    shareEndUI,
    presentUrlRefTB,
) {
    try {
        const licenseKey = config.licenseKey;

        cobrowse.sessions
            .create({
                full_device: 'requested',
            })
            .then(async (data) => {
                if (session) await CobrowseIO.stop();

                // const media = null;
                const media = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        width: { ideal: 1400 },
                        height: { ideal: 1000 },
                        frameRate: { max: 10 },
                    },
                    audio: false,
                });
                // console.log('session b4==> ', session?.id);
                setSession(data);
                // console.log('session ftr==> ', session?.id);
                console.log('media==> ', media);

                media.getVideoTracks()[0].onended = () => {
                    resetPresentSession(CobrowseIO);
                    shareEndUI();
                };

                const viewerToken = await generateViewerJWT(licenseKey, data.id);

                const presentURL = `https://cobrowse.io/session/${data.id}?token=${viewerToken}&agent_tools=none&device_controls=none&end_action=none&popout=none&session_details=none`;
                presentUrlRefTB.current.value = presentURL;

                await CobrowseIO.client();

                CobrowseIO.license = licenseKey;
                CobrowseIO.redactedViews = ['.container'];
                CobrowseIO.capabilities = ['full_device'];
                CobrowseIO.showSessionControls = () => {};
                CobrowseIO.hideSessionControls = () => {};
                CobrowseIO.confirmSession = async () => true;
                CobrowseIO.confirmFullDevice = async () => media;
                CobrowseIO.confirmRemoteControl = async () => false;

                CobrowseIO.on('session.updated', (presentSession) => {
                    if (presentSession.isActive()) {
                        shareStartUI();

                        if (!presentSession.fullDevice()) {
                            // session.end();
                            data.end();
                        }
                    }
                });

                CobrowseIO.on('session.ended', async (presentSession) => {
                    // if (media) media.getTracks().forEach((track) => track.stop());
                    resetPresentSession(CobrowseIO);
                    shareEndUI();
                });

                await CobrowseIO.start({
                    allowIFrameStart: true,
                    register: false,
                });

                await CobrowseIO.getSession(data.id);
            })
            .catch((err) => console.log('Error in creating agent cobrowse session ==> ', err));
    } catch (error) {
        console.log('Error Starting Agent preview (startPresentSession()) ==> ', error);
        throw new Error(error);
    }
}
