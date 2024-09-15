const Adapters = require("../adapters");

const instance = Adapters.getSQLAdapter();

module.exports = {
  load: async () => {
    return await instance.execute("progressionMap.get", `
      WITH lesson_progress AS (
    -- Contagem de questões corretas respondidas por lesson para cada usuário
    SELECT
        l.id AS lesson_id,
        u.id AS user_id,
        COUNT(sqa.id) AS correct_questions_answered
    FROM lesson l
    CROSS JOIN users u -- Combina todas as lessons com todos os usuários
    LEFT JOIN step st ON st.id = l.step
    LEFT JOIN unit un ON un.id = st.unit
    LEFT JOIN session se ON se.id = un.session
    LEFT JOIN subject sub ON sub.id = se.subject
    LEFT JOIN question q ON q.lesson = l.id
    LEFT JOIN student_question_answer sqa ON sqa.question_id = q.id AND sqa.user_id = u.id
    WHERE u.type = 'student'
    GROUP BY l.id, u.id
),
lesson_status AS (
    -- Determinando o status de cada lesson com base nas respostas corretas
    SELECT
        lp.user_id,
        l.id AS lesson_id,
        l."level",
        l.description AS lesson_description,
        COALESCE(lp.correct_questions_answered, 0) AS correct_questions_answered,
        l.questions_quantity,
        CASE
            WHEN COALESCE(lp.correct_questions_answered, 0) = 0 THEN 'unstarted'
            WHEN COALESCE(lp.correct_questions_answered, 0) >= l.questions_quantity THEN 'finish'
            ELSE 'doing'
        END AS lesson_status
    FROM lesson l
    LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id
)
-- Selecionar o progresso de todas as lessons associadas a cada usuário
SELECT
    u.email,
    sub.description AS subject,
    un.description AS unit,
    st.description AS step,
    ls.lesson_description as lesson,
    st."level" as step_priority,
    un."level" as unit_priority,
    ls."level" as lesson_priority,
    ls.lesson_status
FROM users u
JOIN lesson_status ls ON ls.user_id = u.id
JOIN step st ON st.id = (SELECT l.step FROM lesson l WHERE l.id = ls.lesson_id)
JOIN unit un ON un.id = st.unit
JOIN session se ON se.id = un.session
JOIN subject sub ON sub.id = se.subject
ORDER BY u.email, un.description, st.level, ls.lesson_description;
      `);
  },
};
