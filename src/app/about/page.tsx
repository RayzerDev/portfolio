import DataSingleton from "@/utils/dataUtils";

export default async function About() {

  const dataSingleton = DataSingleton.getInstance();
  const workExperiences = await dataSingleton.getWorkExperiencesData();
  const degrees = await dataSingleton.getDegreesData();

  return (
      <div>
        <h1>About</h1>
        <section>
          <h2>Work Experiences</h2>
          <ul>
            {workExperiences?.map((experience, index) => (
                <li key={index}>
                  <h3>{experience.nom}</h3>
                  <p>{experience.type}</p>
                  <p>{experience.entreprise}</p>
                  <p>{experience.ville}</p>
                  <p>{experience.debut} - {experience.fin}</p>
                </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Degrees</h2>
          <ul>
            {degrees?.map((degree, index) => (
                <li key={index}>
                  <h3>{degree.nom}</h3>
                  <p>{degree.type}</p>
                  <p>{degree.ecole}</p>
                  <p>{degree.ville}</p>
                  <p>{degree.debut} - {degree.fin}</p>
                </li>
            ))}
          </ul>
        </section>
      </div>
  );
}