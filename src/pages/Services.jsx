import useMeta from "../hooks/useMeta";

import PageLayout from '../layout/PageLayout';

export default function Services() {
    useMeta({
        title: "Services - Norwest",
        description: "Explore the range of services offered by Norwest, including construction management, design-build, general contracting, and pre-construction consulting.",
        url: "https://norwestds.com/services",
    });


    const items = [
        { t:"Industrial Automation", d: "Implementación de sistemas de control y automatización para optimizar procesos industriales y mejorar la eficiencia operativa." },
        { t:"Control Systems", d: "Diseño e integración de sistemas de control avanzados para supervisar y gestionar procesos industriales de manera eficiente." },
        { t:"Robotics", d: "Desarrollo e implementación de soluciones robóticas personalizadas para automatizar tareas repetitivas y mejorar la productividad." },
        { t:"PLC Programming", d: "Programación y configuración de controladores lógicos programables (PLC) para automatizar procesos industriales complejos." },
        { t:"HMI/SCADA", d: "Diseño e implementación de interfaces hombre-máquina (HMI) y sistemas de control y adquisición de datos (SCADA) para una supervisión eficiente." },
        { t:"Electrical Design", d: "Diseño y desarrollo de sistemas eléctricos para proyectos industriales, asegurando cumplimiento con normativas y estándares." },
        { t:"System Integration", d: "Integración de diversos sistemas y tecnologías para crear soluciones cohesivas que optimicen las operaciones industriales." },
        { t:"Maintenance & Support", d: "Servicios de mantenimiento preventivo y correctivo para asegurar el funcionamiento óptimo de los sistemas automatizados." },
    ]; 

    return (
        <PageLayout>
            <section className="container pad">
                <h1>Servicios</h1>
                <div className="grid">
                    {items.map((x,i)=>(
                    <div className="card" key={i}>
                        <h3>{x.t}</h3>
                        <p>{x.d}</p>
                    </div>
                    ))}
                </div>
            </section>
        </PageLayout>
    );
}