import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "How do I get started with the courses?",
    answer: "Simply sign up for an account, browse our course catalog, and enroll in any course that interests you. You can start learning immediately after enrollment.",
    value: "item-1",
  },
  {
    question: "What types of courses do you offer?",
    answer: "We offer a wide range of courses including web development, programming, data science, UI/UX design, and more. Our courses are designed for both beginners and advanced learners.",
    value: "item-2",
  },
  {
    question: "Do I get a certificate after completing a course?",
    answer: "Yes! Upon successful completion of any course, you'll receive a verified certificate that you can share on your LinkedIn profile or with potential employers.",
    value: "item-3",
  },
  {
    question: "Can I interact with the instructors?",
    answer: "Absolutely! Our platform provides direct communication with instructors through discussion forums, live Q&A sessions, and personal messaging.",
    value: "item-4",
  },
  {
    question: "What is the refund policy?",
    answer: "We offer a 30-day money-back guarantee if you're not satisfied with the course. No questions asked!",
    value: "item-5",
  },
  {
    question: "Are the courses self-paced?",
    answer: "Yes, all our courses are self-paced. You can learn at your own speed and access the course content 24/7.",
    value: "item-6",
  }
];

export const FAQ = () => {
  return (
    <section
      id="faq"
      className="container py-24 md:px-20 sm:px-3 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Frequently Asked{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Questions
        </span>
      </h2>

      <p className="text-muted-foreground mb-8 max-w-2xl me-auto">
        Get quick answers to common questions about our learning platform, courses, and teaching methods.
      </p>

      <Accordion
        type="single"
        collapsible
        className="w-full AccordionRoot"
      >
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem
            key={value}
            value={value}
          >
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-4">
        Still have questions?{" "}
        <a
          rel="noreferrer noopener"
          href="#newsletter"
          className="text-primary transition-all border-primary hover:border-b-2"
        >
          Contact us
        </a>
      </h3>
    </section>
  );
};
