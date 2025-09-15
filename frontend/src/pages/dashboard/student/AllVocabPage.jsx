import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../../../components/common/Card";
import { getStudentAssignments } from "../../../services/studentService";
import { Button } from "@headlessui/react";

const AllVocabPage = ({ studentId = 6 }) => {
  const { materialId } = useParams();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const assignments = await getStudentAssignments(studentId);
        const matId = Number(materialId);

        console.log("===> materialId param:", matId);
        console.log("===> All assignments:", assignments);

        const assignment = assignments.find(
          (a) => Number(a.material_id) === matId
        );

        console.log("===> Found assignment:", assignment);

        setFlashcards(assignment?.flashcards || []);
      } catch (err) {
        console.error("Error loading flashcards:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [materialId, studentId]);

  if (loading) return <div>Đang tải flashcards...</div>;
  if (!flashcards.length) return <div>Chưa có flashcards cho bài này.</div>;

  return (
    <div className="p-6">
      <Button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        ← Quay lại
      </Button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {flashcards.map((f) => (
          <Card
            key={f.flashcard_id || f.id}
            className="flex flex-col items-center p-3 text-center border rounded-lg shadow-sm hover:shadow-md bg-white cursor-pointer"
          >
            {f.image_url && (
              <div className="w-full aspect-square mb-2 overflow-hidden rounded-md">
                <img
                  src={f.image_url}
                  alt={f.term}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="font-semibold text-gray-800 mb-1 bg-blue-200 px-4 py-2 rounded-md">
              {f.term}
            </div>
            <div className="text-gray-600 text-sm">{f.definition}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AllVocabPage;
