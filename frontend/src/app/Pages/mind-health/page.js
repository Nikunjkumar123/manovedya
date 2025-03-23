import React from "react";
import image from "../../Images/mind-health-img.png";
import Image from "next/image";
import "./mindHealth.css";
import Link from "next/link";
const page = () => {
  const testData = [
    {
      title: "Stress, Anxiety & Depression Test",
      description: [
        "Constant worry",
        "Restlessness",
        "Loss of motivation",
        "Persistent sadness",
        "Overwhelming stress",
      ],
      bgColor: "#88BBF0",
      pageUrl : "/page/mental-health-test"
    },
    {
      title: "Cognitive Function Test",
      description: [
        "Forgetfulness",
        "Difficulty concentrating",
        "Mental fatigue",
        "Challenges in decision-making",
      ],
      bgColor: "#130059",
    },
    {
      title: "Behavioral Test (Anger & Panic)",
      description: [
        "Frequent irritability",
        "Uncontrollable anger",
        "Sudden panic episodes",
        "Impulsive behavior",
      ],
      bgColor: "#510045",
    },
    {
      title: "Sleep Disorder Test (Insomnia & Sleep Issues)",
      description: [
        "Trouble falling asleep",
        "Waking up frequently during the night",
        "Feeling tired despite sleeping",
        "Irregular sleep patterns",
      ],
      bgColor: "#B0006C",
    },
    {
      title: "Trauma & PTSD Test",
      description: [
        "Flashbacks",
        "Nightmares",
        "Emotional numbness",
        "Heightened stress levels",
        "Other distressing events",
      ],
      bgColor: "#F59200",
    },
    {
      title: "Substance Abuse & Addiction Test",
      description: [
        "Increased use of one or several substances",
        "Withdrawal symptoms",
        "Neglecting responsibilities due to usage",
      ],
      bgColor: "#63358F",
    },
    {
      title: "Mood Disorders & Bipolar Test",
      description: [
        "Frequent mood swings",
        "Bursts of energy",
        "Feelings of despair",
        "Difficulty maintaining relationships",
      ],
      bgColor: "#E34A5F",
    },
    {
      title: "Eating Disorder Test",
      description: [
        "Obsessing over food",
        "Guilt after meals",
        "Drastic weight changes",
        "Frequent dieting",
      ],
      bgColor: "#8C52C2",
    },
  ];
  return (
    <>
      <section className="mind-health-test">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-9">
              <h4>MENTAL HEALTH SELF TEST</h4>
              <p>
                Understanding your <b> mental well-being</b> is the first step
                toward a healthier, more balanced life. Our self-tests are
                designed to help you <b> gain insights into your emotions,</b>{" "}
                thoughts, and behaviors. These assessments allow you to explore
                specific areas of mental health, such as stress, anxiety, focus,
                or sleep issues, helping you <b> identify patterns</b> that may
                need attention. Whether you’re experiencing challenges in daily
                life or simply want to understand yourself better, these tests
                can be a <b> helpful guide.</b>
              </p>
              <p>
                <b>Disclaimer:</b> These self-tests are intended to provide
                insights into your mental health and are not a substitute for
                professional diagnosis or treatment. For a full evaluation or if
                you have concerns about your mental health, please consult a
                licensed mental health professional or physician.
              </p>
            </div>
            <div className="col-md-3">
              <div className="health-mind-image">
                <Image src={image} alt="health mind image" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mind-health-test-cards">
        <div className="container">
          <div className="text-center">
            <h2>
            Select Your Mental Health Test Area
            </h2>
          </div>
          <hr />
          <div className="row">
            {testData.map((test, index) => (
              <div className="col-12 col-sm-6 col-md-4 mb-3" key={index}>
                <div data-aos="fade-up" className="health-test-card-main" style={{ backgroundColor: test.bgColor, color: "#000" }}>
                  <div className="card-body">
                    <Link href={"/Pages/mental-health-test"}>
                      <h5 className="card-title">{test.title}</h5>
                      <ul>
                        {test.description.map((point, idx) => (
                          <li className="text-white" key={idx}>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default page;
