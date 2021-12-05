import {useContext, useEffect, useState} from "react";
import {SubjectControllerApi} from "typescript-axios";
import SubjectCardView from "../SubjectCardView";
import Navbar from "../layout/Navbar";
import BurgerMenu from "../layout/BurgerMenu";
import {URLS} from "../../App";
import SubjectSelectionContext from "../../context/subjectSelectionContext";
import userContext from "../../context/userContext";
import {getRequestHeaders} from "../../util/util";

/**
 * Provides an overview of all available subjects.
 * @return {JSX.Element}
 * @constructor
 */
function SubjectOverview() {
    const subjectApi = new SubjectControllerApi();
    const {user, setUser} = useContext(userContext);
    const [userInfo, setUserInfo] = useState(null);
    const [subjects, setSubjects] = useState(null);
    const {subjectSelection, setSubjectSelection} = useContext(SubjectSelectionContext);

    useEffect(() => {
        if (user) {
            return user.loadUserInfo().then((userInfo) => {
                setUserInfo(userInfo);
                if (!subjects) {
                    console.log('get subjects!');
                    return subjectApi.getAllSubjects(getRequestHeaders(user))
                        .then((response) => {
                            console.log(`first subject: ${JSON.stringify(response.data[0])}`);
                            setSubjects(response.data);
                        })
                        .catch((err) => console.log(`Error! ${err}`));
                }
            });
        }
    }, [subjects, user, setUserInfo]);

    /**
     * Check if the user has selected the given subject for registration.
     * @param {Object} subject Subject to check.
     * @return {boolean} Returns true if the subject is selected; otherwise false.
     */
    const isRegistered = (subject) => {
        return subjectSelection.some((s) => subject.id === s.id);
    };

    return (
        <>
            <Navbar />
            <BurgerMenu name={URLS.SUBJECTS} username={userInfo ? `${userInfo.given_name} ${userInfo.family_name}` : ''}
                        major={userInfo ? userInfo.degreeCourse : ''}
                        preferred_username={userInfo ? userInfo.preferred_username : ''}
                        logout={user ? user.logout : null}
                        timestamp={userInfo ? userInfo.createTimestamp : '20210911'}
            />
            <div className="container main">
                <div className="row">
                    <h2 style={{marginBottom: '0.75em'}}>Übersicht Wahlpflichtfächer</h2>
                    <p>Hier finden Sie alle Wahlpflichtfächer, die in diesem Semester angeboten werden.<br/>
                        Wenn Sie sich für einen bestimmten Wahlpflichtfach anmelden möchten, klicken Sie auf
                        'Anmelden' in der Aktionsleiste.<br/>Detaillierte Informationen zu den Wahlpflichtfächern finden
                        Sie im <a href="/">Modulhandbuch</a>.</p>
                    <div className="row row-cols-4 mt-1 mb-4 g-3">
                        {
                            subjects && subjects.length > 0 ? subjects.map((subject) => (
                                <SubjectCardView key={subject.id.toString()} subject={subject.name}
                                                 id={subject.id}
                                                 professor={subject.professor}
                                                 creditPoints={subject.creditPoints}
                                                 description={subject.description}
                                                 specialization={subject.specialization}
                                                 enroll={subjectSelection ? !isRegistered(subject) : true}/>
                            )) : <p>Momentan sind keine Wahlpflichtfächer vorhanden.</p>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default SubjectOverview;
