import requests
from django.conf import settings
from icalendar import Calendar
from rest_framework import serializers


class CurrentOrganizationDefault:
    """
    Utility class to get the current organization right from the serializer field.
    In pair with serializers.HiddenField gives an ability to create objects
    without overriding perform_create on the model, while respecting unique_together constraints.
    Example: organization = serializers.HiddenField(default=CurrentOrganizationDefault())
    """

    def set_context(self, serializer_field):
        self.organization = serializer_field.context["request"].auth.organization

    def __call__(self):
        return self.organization

    def __repr__(self):
        return "%s()" % self.__class__.__name__


class CurrentTeamDefault:
    """
    Utility class to get the current team right from the serializer field.
    """

    def set_context(self, serializer_field):
        self.team = serializer_field.context["request"].user.current_team

    def __call__(self):
        return self.team

    def __repr__(self):
        return "%s()" % self.__class__.__name__


def validate_ical_url(url):
    if url:
        if settings.BASE_URL in url:
            raise serializers.ValidationError("Potential self-reference")
        try:
            ical_file = requests.get(url).text
            Calendar.from_ical(ical_file)
        except requests.exceptions.RequestException:
            raise serializers.ValidationError("Ical download failed")
        except ValueError:
            raise serializers.ValidationError("Ical parse failed")
        return url
    return None