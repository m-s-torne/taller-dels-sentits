import { TeamMember } from "../types/quiSom.types";

export const MemberCard = ({ member }: { member: TeamMember }) => {
    return (
        <div className="mt-8 w-screen relative left-1/2 right-1/2 -mx-[50vw] bg-shakespeare">
            <div className="max-w-5xl mx-auto px-4 md:px-10 py-10">
                <h3 className="text-xl sm:text-2xl font-normal text-lilac! mb-6">
                    {member.name}
                </h3>
                <div className="flex flex-col md:block md:overflow-hidden">
                    {member.image && (
                        <img
                            src={member.image}
                            alt={member.name}
                            className="w-64 object-cover rounded-[40px] mb-6 md:float-left md:mr-12 md:mb-4"
                        />
                    )}
                    <div className="space-y-4">
                        {member.bio.map((paragraph, i) => (
                            <p key={i} className="text-lilac! font-light text-sm sm:text-base lg:text-lg leading-relaxed">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
