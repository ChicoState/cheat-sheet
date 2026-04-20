from rest_framework import serializers

from .models import Template, CheatSheet, PracticeProblem
from .services.practice_problem_compiler import compile_source


class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = [
            "id",
            "name",
            "subject",
            "description",
            "latex_content",
            "default_margins",
            "default_columns",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class PracticeProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PracticeProblem
        fields = [
            "id",
            "cheat_sheet",
            "label",
            "source_format",
            "source_text",
            "compiled_latex",
            "question_latex",
            "answer_latex",
            "order",
        ]
        read_only_fields = ["id", "compiled_latex"]
        extra_kwargs = {
            "question_latex": {"required": False, "allow_blank": True},
            "answer_latex": {"required": False, "allow_blank": True},
            "source_text": {"required": False, "allow_blank": True},
            "label": {"required": False, "allow_blank": True},
            "source_format": {"required": False},
        }

    def validate(self, attrs):
        attrs = super().validate(attrs)

        instance = getattr(self, "instance", None)
        submitted_legacy_fields = any(
            field in attrs for field in ["question_latex", "answer_latex"]
        )
        label = attrs.get("label", getattr(instance, "label", ""))
        source_format = attrs.get(
            "source_format",
            getattr(instance, "source_format", "simple_v1"),
        )
        source_text = attrs.get("source_text", getattr(instance, "source_text", ""))

        if source_format not in {"simple_v1", "latex_legacy"}:
            raise serializers.ValidationError(
                {"source_format": ["Unsupported source format. Use 'simple_v1' or 'latex_legacy'."]}
            )

        if submitted_legacy_fields:
            raise serializers.ValidationError(
                {
                    "question_latex": [
                        "Direct LaTeX problem fields are read-only. Use source_text with simple_v1 instead."
                    ]
                }
            )

        if source_text:
            if source_format != "simple_v1":
                raise serializers.ValidationError(
                    {"source_format": ["source_text currently supports only 'simple_v1'."]}
                )

            result = compile_source(source_text, label=label)
            if not result.is_valid:
                raise serializers.ValidationError(
                    {
                        "source_text": [
                            f"Line {error.line}: {error.message}" for error in result.errors
                        ]
                    }
                )

            attrs["source_format"] = "simple_v1"
            attrs["compiled_latex"] = result.compiled_latex
            return attrs

        if source_format == "simple_v1":
            raise serializers.ValidationError(
                {"source_text": ["Provide source_text for simple_v1 problems."]}
            )

        return attrs


class PracticeProblemPreviewSerializer(serializers.Serializer):
    label = serializers.CharField(required=False, allow_blank=True, default="")
    source_format = serializers.CharField(required=False, default="simple_v1")
    source_text = serializers.CharField()

    def validate(self, attrs):
        if attrs.get("source_format") != "simple_v1":
            raise serializers.ValidationError(
                {"source_format": ["Preview currently supports only 'simple_v1'."]}
            )

        return attrs


class CheatSheetSerializer(serializers.ModelSerializer):
    problems = PracticeProblemSerializer(many=True, read_only=True)
    full_latex = serializers.SerializerMethodField()

    class Meta:
        model = CheatSheet
        fields = [
            "id",
            "title",
            "template",
            "latex_content",
            "margins",
            "columns",
            "font_size",
            "selected_formulas",
            "problems",
            "full_latex",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "full_latex"]

    def get_full_latex(self, obj):
        """Return the fully-assembled LaTeX document string."""
        return obj.build_full_latex()


class CompileRequestSerializer(serializers.Serializer):
    """Accepts either raw content OR a cheat_sheet id to compile."""

    content = serializers.CharField(required=False, default="")
    cheat_sheet_id = serializers.IntegerField(required=False, default=None)

    def validate(self, attrs):
        if not attrs.get("content") and not attrs.get("cheat_sheet_id"):
            raise serializers.ValidationError(
                "Provide either 'content' or 'cheat_sheet_id'."
            )
        return attrs
