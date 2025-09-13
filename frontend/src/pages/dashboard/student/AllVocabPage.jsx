import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../../../components/common/Card";
import { getStudentAssignments } from "../../../services/studentService";


const AllVocabPage = ({ studentId = 6 }) => {
  const { materialId } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const assignments = await getStudentAssignments(studentId);
        const matId = Number(materialId);
        const assignment = assignments.find(a => Number(a.id) === matId);

        if (!assignment) {
          setFlashcards([]);
          return;
        }

        setFlashcards(assignment.flashcards || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [materialId, studentId]);

  if (loading) return <div>Đang tải flashcards...</div>;
  if (!flashcards.length) return <div>Chưa có flashcards cho bài này.</div>;

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {flashcards.map((f) => (
        <Card
          key={f.flashcard_id || f.id}
          className="flex flex-col items-center p-3 text-center border rounded-lg shadow-sm hover:shadow-md bg-white cursor-pointer"
        >
          {f.image_url && (
            <div className="w-full aspect-square mb-2 overflow-hidden rounded-md">
              <img src={f.image_url} alt={f.term} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="font-semibold text-gray-800 mb-1 bg-blue-200 px-4 py-2 rounded-md">
            {f.term}
          </div>
          <div className="text-gray-600 text-sm">{f.definition}</div>
        </Card>
      ))}
    </div>
  );
};

export default AllVocabPage;
